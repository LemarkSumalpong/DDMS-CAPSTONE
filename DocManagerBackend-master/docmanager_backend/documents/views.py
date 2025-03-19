from rest_framework import generics
from .serializers import (
    DocumentSerializer,
    DocumentFileSerializer,
    DocumentUploadSerializer,
    DocumentDeleteSerializer,
    DocumentUpdateSerializer
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination
from accounts.permissions import IsStaff, IsHead
from .models import Document
from django.db.models import Q
from operator import or_
from functools import reduce


class DocumentPagination(PageNumberPagination):
    page_size = 7
    page_size_query_param = 'page_size'
    max_page_size = 7


class DocumentUpdateView(generics.UpdateAPIView):
    """
    Used by staff to upload documents.
    """

    http_method_names = ["patch"]
    serializer_class = DocumentUpdateSerializer
    queryset = Document.objects.all()
    permission_classes = [IsAuthenticated, IsHead]


class DocumentUploadView(generics.CreateAPIView):
    """
    Used by staff to upload documents.
    """

    http_method_names = ["post"]
    serializer_class = DocumentUploadSerializer
    permission_classes = [IsAuthenticated, IsStaff]


class DocumentDeleteView(generics.DestroyAPIView):
    """
    Used by staff to delete documents. Accepts the document id as a URL parameter
    """

    http_method_names = ["delete"]
    serializer_class = DocumentDeleteSerializer
    queryset = Document.objects.all()
    permission_classes = [IsAuthenticated, IsStaff]


class DocumentListView(generics.ListAPIView):
    """
    Used by clients to view documents. Does not include actual download links to documents
    """

    http_method_names = ["get"]
    serializer_class = DocumentSerializer
    queryset = Document.objects.all().order_by("-date_uploaded")
    pagination_class = DocumentPagination
    permission_classes = [IsAuthenticated]

class WidgetDocumentListView(generics.ListAPIView):
    """
    Used by a widget for clients to view documents. Does not include actual download links to documents
    """

    http_method_names = ["get"]
    serializer_class = DocumentSerializer
    queryset = Document.objects.all().order_by("-date_uploaded")
    pagination_class = PageNumberPagination
    permission_classes = [IsAuthenticated]


class DocumentStaffListView(generics.ListAPIView):
    """
    Used by staff to view documents. Includes actual download links to documents
    """

    http_method_names = ["get"]
    serializer_class = DocumentFileSerializer
    queryset = Document.objects.all().order_by("-date_uploaded")
    pagination_class = DocumentPagination
    permission_classes = [IsAuthenticated, IsStaff]

    def get_queryset(self):
        # Get the base queryset
        queryset = super().get_queryset()

        # Check if 'keywords' query parameter is present
        keyword = self.request.query_params.get('search', None)

        if keyword:
            queries = []
            # Create a list to hold individual field conditions for this keyword
            field_queries = [
                Q(name__icontains=keyword),
                Q(document_type__icontains=keyword),
                Q(sent_from__icontains=keyword),
                Q(document_month__icontains=keyword),
                Q(document_year__icontains=keyword),
                Q(subject__icontains=keyword),
                Q(ocr_metadata__icontains=keyword)
            ]
            # Combine the field conditions with OR
            combined_query = Q()
            for q in field_queries:
                if not combined_query:
                    combined_query = q
                else:
                    combined_query |= q
            queries.append(combined_query)

            # Now combine all keyword conditions with OR
            final_query = Q()
            for q in queries:
                if not final_query:
                    final_query = q
                else:
                    final_query |= q

            queryset = queryset.filter(final_query)

        # Add filters for document_month and document_year if provided
        document_month = self.request.query_params.get('document_month', None)
        document_year = self.request.query_params.get('document_year', None)

        if document_month:
            queryset = queryset.filter(document_month=document_month)

        if document_year:
            queryset = queryset.filter(document_year=document_year)

        # Add filtering for document_type
        document_type = self.request.query_params.get('document_type', None)
        if document_type and document_type != "All":  # If "All" is selected, don't filter
         if document_type:
            if document_type == "Others":
                # Exclude default types "Memorandum" and "Special Orders"
                queryset = queryset.exclude(
                    Q(document_type="Memorandum") | Q(document_type="Special Orders")
                )
            else:
                queryset = queryset.filter(document_type=document_type)

        # Handle sorting
        sort = self.request.query_params.get('sort', None)
        direction = self.request.query_params.get('direction', 'asc')

        if sort:
            # Add prefix "-" for descending order
            if direction == "desc":
                sort = f"-{sort}"
            queryset = queryset.order_by(sort)
        else:
            # Default sorting to "date_uploaded" descending
            queryset = queryset.order_by("-date_uploaded")

        return queryset
    
    def get_distinct_years(self):
        # Retrieve distinct years from the Document model
        return Document.objects.values('document_year').distinct()

class WidgetDocumentStaffListView(generics.ListAPIView):
    """
    Used by a widget for staff to view documents. Includes actual download links to documents
    """

    http_method_names = ["get"]
    serializer_class = DocumentFileSerializer
    queryset = Document.objects.all().order_by("-date_uploaded")
    pagination_class = PageNumberPagination
    permission_classes = [IsAuthenticated, IsStaff]

    def get_queryset(self):
        # Get the base queryset
        queryset = super().get_queryset()

        # Check if 'keywords' query parameter is present
        keyword = self.request.query_params.get('search', None)

        if keyword:
            queries = []
            # Create a list to hold individual field conditions for this keyword
            field_queries = [
                Q(name__icontains=keyword),
                Q(document_type__icontains=keyword),
                Q(sent_from__icontains=keyword),
                Q(document_month__icontains=keyword),
                Q(document_year__icontains=keyword),
                Q(subject__icontains=keyword),
                Q(ocr_metadata__icontains=keyword)
            ]
            # Combine the field conditions with OR
            combined_query = Q()
            for q in field_queries:
                if not combined_query:
                    combined_query = q
                else:
                    combined_query |= q
            queries.append(combined_query)

            # Now combine all keyword conditions with OR
            final_query = Q()
            for q in queries:
                if not final_query:
                    final_query = q
                else:
                    final_query |= q

            queryset = queryset.filter(final_query)

        return queryset
