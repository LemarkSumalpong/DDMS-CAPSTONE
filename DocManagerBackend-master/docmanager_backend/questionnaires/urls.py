from django.urls import include, path
from .views import (
    QuestionnaireListAPIView,
    QuestionnaireSubmitView,
    WidgetQuestionnaireListAPIView
)

urlpatterns = [
    path("submit/", QuestionnaireSubmitView.as_view()),
    path("list/", QuestionnaireListAPIView.as_view()),
    path("widget/", QuestionnaireListAPIView.as_view()),
]
