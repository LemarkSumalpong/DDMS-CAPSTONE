from rest_framework import generics
from .serializers import QuestionnaireSerializer
from rest_framework.permissions import IsAuthenticated
from .models import Questionnaire
from rest_framework.pagination import PageNumberPagination
from accounts.permissions import IsStaff, IsPlanning

class QuestionnairePagination(PageNumberPagination):
    page_size = 4
    page_size_query_param = 'page_size'
    max_page_size = 4

class QuestionnaireListAPIView(generics.ListAPIView):
    """
    Used by staff to view questionnaires
    """

    http_method_names = ["get"]
    serializer_class = QuestionnaireSerializer
    queryset = Questionnaire.objects.all()
    pagination_class = QuestionnairePagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user

        # Base queryset based on user role
        if user.role == "client":
            queryset = Questionnaire.objects.filter(client=user)
        else:
            queryset = Questionnaire.objects.all()

        # Filter by date range if provided
        start_date = self.request.query_params.get('start_date', None)
        end_date = self.request.query_params.get('end_date', None)
        if start_date or end_date:
            if start_date and end_date:
                queryset = queryset.filter(date_requested__range=[start_date, end_date])
            elif start_date:
                queryset = queryset.filter(date_requested__gte=start_date)
            elif end_date:
                queryset = queryset.filter(date_requested__lte=end_date)

        # Handle sorting by fields and direction
        sort = self.request.query_params.get("sort", "date_submitted")  # Default to "date_submitted" if not provided
        direction = self.request.query_params.get("direction", "asc")  # Default to "asc" if not provided

        # Apply sorting
        if direction == "desc":
            queryset = queryset.order_by(f"-{sort}")  # Prefix "-" for descending order
        else:
            queryset = queryset.order_by(f"{sort}")  # No prefix for ascending order

        return queryset

class WidgetQuestionnaireListAPIView(generics.ListAPIView):
    """
    Used by staff to view questionnaires
    """

    http_method_names = ["get"]
    serializer_class = QuestionnaireSerializer
    queryset = Questionnaire.objects.all()
    pagination_class = PageNumberPagination
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.role == "client":
            return Questionnaire.objects.filter(client=user)
        else:
            return Questionnaire.objects.all()

class QuestionnaireSubmitView(generics.CreateAPIView):
    """
    Used by clients to submit questionnaires
    """

    http_method_names = ["post"]
    serializer_class = QuestionnaireSerializer
    permission_classes = [IsAuthenticated]
