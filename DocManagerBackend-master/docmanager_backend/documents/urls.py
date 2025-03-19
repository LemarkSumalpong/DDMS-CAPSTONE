from django.urls import include, path
from .views import (
    DocumentUploadView,
    DocumentDeleteView,
    DocumentListView,
    DocumentStaffListView,
    DocumentUpdateView,
    WidgetDocumentListView,
    WidgetDocumentStaffListView
)

urlpatterns = [
    path("upload/", DocumentUploadView.as_view()),
    path("update/<int:pk>/", DocumentUpdateView.as_view()),
    path("delete/<int:pk>/", DocumentDeleteView.as_view()),
    path("list/", DocumentListView.as_view()),
    path("list/staff/", DocumentStaffListView.as_view()),
    path("widget/", WidgetDocumentListView.as_view()),
    path("widget/staff/", WidgetDocumentStaffListView.as_view()),
]
