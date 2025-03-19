from django.urls import path, include
from .views import (
    DocumentRequestCreateView,
    DocumentRequestListView,
    DocumentRequestUpdateView,
    DocumentRequestFullListView,
    WidgetDocumentRequestListView,
    WidgetDocumentRequestFullListView
)

urlpatterns = [
    path("create/", DocumentRequestCreateView.as_view()),
    path("list/", DocumentRequestListView.as_view()),
    path("list/head/", DocumentRequestFullListView.as_view()),
    path("update/<int:pk>/", DocumentRequestUpdateView.as_view()),
    path("widget/", WidgetDocumentRequestListView.as_view()),
    path("widget/head/", WidgetDocumentRequestFullListView.as_view()),
]
