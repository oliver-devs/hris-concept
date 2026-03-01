from django.contrib import admin
from django.urls import path, include
from api.views import CurrentUserView

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
    path("api/me/", CurrentUserView.as_view(), name="current-user"),
]
