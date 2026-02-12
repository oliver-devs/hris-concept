from django.contrib import admin
from django.urls import path, include

# WICHTIG 1: Import für den Login
from rest_framework.authtoken.views import obtain_auth_token

# WICHTIG 2: Import für den Namen (deine neue View)
from api.views import CurrentUserView

urlpatterns = [
    # 1. Admin-Oberfläche
    path("admin/", admin.site.urls),
    # 2. LOGIN (Das hat wahrscheinlich gefehlt!)
    path("api-token-auth/", obtain_auth_token, name="api_token_auth"),
    # 3. Deine API (Mitarbeiter, Abteilungen etc.)
    path("api/", include("api.urls")),
    # 4. Der neue "Wer bin ich?" Endpoint
    path("api/me/", CurrentUserView.as_view(), name="current-user"),
]
