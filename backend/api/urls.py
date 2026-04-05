from django.urls import path
#from .views import ping
from .views import ping_view

#urlpatterns = [
#    path("ping/", ping),   # ← IMPORTANT: trailing slash
#]

urlpatterns = [
    path('ping/', ping_view),
]
