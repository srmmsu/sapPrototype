"""
URL configuration for sapbackend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include, re_path
from api.views import index, ping_view, service_worker
from django.views.static import serve
from django.conf import settings
import os

urlpatterns = [
    path('admin/', admin.site.urls),    

    # API
    path("api/", include("api.urls")),
    path('api/ping/', ping_view),

    # Service Worker
    path('sw.js', service_worker),

    # ✅ Manifest (served from backend/static)
    path(
        "manifest.json",
        serve,
        {
            "path": "manifest.json",
            "document_root": os.path.join(settings.BASE_DIR, "static"),
        },
    ),

    # React fallback
    re_path(r'^.*$', index),
]
