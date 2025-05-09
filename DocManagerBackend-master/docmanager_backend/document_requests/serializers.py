from rest_framework import serializers
from documents.models import Document
from documents.serializers import DocumentSerializer, DocumentFileSerializer
from questionnaires.models import Questionnaire
from accounts.models import CustomUser
from emails.templates import RequestUpdateEmail
from .models import DocumentRequest, DocumentRequestUnit
from notifications.models import Notification


class DocumentRequestUnitCreationSerializer(serializers.ModelSerializer):
    document = serializers.SlugRelatedField(
        many=False, slug_field="id", queryset=Document.objects.all(), required=True
    )
    copies = serializers.IntegerField(min_value=1)

    class Meta:
        model = DocumentRequestUnit
        fields = ["document", "copies"]


class DocumentRequestCreationSerializer(serializers.ModelSerializer):
    requester = serializers.SlugRelatedField(
        many=False, slug_field="id", queryset=CustomUser.objects.all(), required=False
    )
    documents = DocumentRequestUnitCreationSerializer(many=True, required=True)
    college = serializers.CharField(max_length=64)
    purpose = serializers.CharField(max_length=512)
    type = serializers.ChoiceField(
        choices=DocumentRequest.TYPE_CHOICES, required=True)

    class Meta:
        model = DocumentRequest
        fields = ["requester", "college", "type", "purpose", "documents"]

    def create(self, validated_data):
        user = self.context["request"].user
        documents_data = validated_data.pop("documents")
        if not documents_data:
            raise serializers.ValidationError(
                {"error": "No documents provided"}
            )
        # Set requester to user who sent HTTP request to prevent spoofing
        validated_data["requester"] = user

        if validated_data["type"] == "softcopy":
            raise serializers.ValidationError(
                {"error": "Hardcopy requests are not accepted as of now"}
            )
        DOCUMENT_REQUEST = DocumentRequest.objects.create(**validated_data)

        DOCUMENT_REQUEST_UNITS = []
        for DOCUMENT_REQUEST_UNIT in documents_data:
            DOCUMENT_REQUEST_UNIT = DocumentRequestUnit.objects.create(
                document_request=DOCUMENT_REQUEST,
                document=DOCUMENT_REQUEST_UNIT["document"],
                copies=DOCUMENT_REQUEST_UNIT["copies"],
            )
            DOCUMENT_REQUEST_UNITS.append(DOCUMENT_REQUEST_UNIT)

        DOCUMENT_REQUEST.documents.set(DOCUMENT_REQUEST_UNITS)
        DOCUMENT_REQUEST.save()

        Notification.objects.create(
            type="info",
            audience="head",
            content=f"A new document request ID:{DOCUMENT_REQUEST.id} requires your attention")

        return DOCUMENT_REQUEST


class DocumentRequestUnitSerializer(serializers.ModelSerializer):
    document = DocumentSerializer(many=False)

    class Meta:
        model = DocumentRequestUnit
        fields = ["id", "document", "copies"]
        read_only_fields = ["id", "document", "copies"]


class DocumentRequestUnitWithFileSerializer(serializers.ModelSerializer):
    document = DocumentFileSerializer(many=False)

    class Meta:
        model = DocumentRequestUnit
        fields = ["id", "document", "copies"]
        read_only_fields = ["id", "document", "copies"]


class DocumentRequestSerializer(serializers.ModelSerializer):
    documents = serializers.SerializerMethodField()
    questionnaire = serializers.SlugRelatedField(
        many=False,
        slug_field="id",
        queryset=Questionnaire.objects.all(),
    )
    requester = serializers.SlugRelatedField(
        many=False,
        slug_field="full_name",
        queryset=CustomUser.objects.all(),
    )
    purpose = serializers.CharField(max_length=512)
    date_requested = serializers.DateTimeField(
        format="%m-%d-%Y %I:%M %p", read_only=True
    )

    class Meta:
        model = DocumentRequest
        fields = [
            "id",
            "questionnaire",
            "requester",
            "college",
            "type",
            "purpose",
            "date_requested",
            "documents",
            "remarks",
            "status",
        ]
        read_only_fields = [
            "id",
            "questionnaire",
            "requester",
            "college",
            "type",
            "purpose",
            "date_requested",
            "documents",
            "remarks,"
            "status",
        ]

    def get_documents(self, obj):
        if obj.questionnaire and obj.status == "approved":
            serializer_class = DocumentRequestUnitWithFileSerializer
        else:
            serializer_class = DocumentRequestUnitSerializer
        return serializer_class(obj.documents, many=True).data


class FullDocumentRequestSerializer(serializers.ModelSerializer):
    documents = DocumentRequestUnitWithFileSerializer(many=True)
    requester = serializers.SlugRelatedField(
        many=False,
        slug_field="full_name",
        queryset=CustomUser.objects.all(),
        required=False,
    )
    purpose = serializers.CharField(max_length=512)
    date_requested = serializers.DateTimeField(
        format="%m-%d-%Y %I:%M %p", read_only=True
    )

    class Meta:
        model = DocumentRequest
        fields = [
            "id",
            "requester",
            "college",
            "type",
            "purpose",
            "date_requested",
            "documents",
            "remarks",
            "status",
        ]
        read_only_fields = [
            "id",
            "requester",
            "college",
            "type",
            "purpose",
            "date_requested",
            "documents",
            "status",
        ]


class DocumentRequestUpdateSerializer(serializers.ModelSerializer):
    status = serializers.ChoiceField(
        choices=DocumentRequest.STATUS_CHOICES, required=True
    )

    class Meta:
        model = DocumentRequest
        fields = ["id", "status", "remarks"]
        read_only_fields = ["id"]

    def update(self, instance, validated_data):
        if "status" not in validated_data:
            raise serializers.ValidationError(
                {
                    "error": "No status value update provided"
                }
            )
        elif instance.status == "denied" or instance.status == "claimed":
            raise serializers.ValidationError(
                {
                    "error": "Already claimed/denied requests cannot be updated. You should instead create a new request and approve it from there"
                }
            )
        elif validated_data["status"] == instance.status:
            raise serializers.ValidationError(
                {"error": "Request form status provided is the same as current status"}
            )
        elif instance.status == "approved" and validated_data["status"] not in ["claimed", "unclaimed"]:
            raise serializers.ValidationError(
                {"error": "Approved request forms can only be marked as claimed or unclaimed"}
            )
        elif instance.status == "unclaimed" and validated_data["status"] not in ["claimed"]:
            raise serializers.ValidationError(
                {"error": "Unclaimed request forms can only be marked as claimed"}
            )
        elif validated_data["status"] == "denied" and "remarks" not in validated_data:
            raise serializers.ValidationError(
                {"error": "Request denial requires remarks"}
            )
        representation = super().update(instance, validated_data)

        # Send an email on request status update
        try:
            email = RequestUpdateEmail()
            if validated_data["status"] == "denied":
                email.context = {"request_status": "denied"}
                email.context = {"remarks": validated_data["remarks"]}
                Notification.objects.create(
                    client=instance.requester,
                    type="info",
                    audience="client",
                    content=f"Your authorization request ID:{instance.id} has been denied")
            else:
                email.context = {"request_status": "approved"}
                email.context = {"remarks": "N/A"}
                Notification.objects.create(
                    client=instance.requester,
                    type="info",
                    audience="client",
                    content=f"Your authorization request ID:{instance.id} has been approved")
            email.send(to=[instance.requester.email])
        except:
            # Silence out errors if email sending fails
            pass

        return representation
