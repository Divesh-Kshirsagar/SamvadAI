from django.contrib import admin
from django.urls import path
from ninja import NinjaAPI
from complaints.api import router as complaints_router

api = NinjaAPI(title="SamvadAI API", version="1.0.0")
api.add_router("/complaints", complaints_router)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]
