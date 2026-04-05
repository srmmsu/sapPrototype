from django.shortcuts import render

from django.http import JsonResponse, HttpResponse
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def index(request):
    file_path = os.path.join(BASE_DIR, 'static', 'index.html')
    with open(file_path, 'r') as f:
        return HttpResponse(f.read())

def ping_view(request):
    return JsonResponse({"status": "ok"})        

def service_worker(request):
    file_path = os.path.join(BASE_DIR, 'static', 'sw.js')

    with open(file_path, 'rb') as f:
        response = HttpResponse(f.read(), content_type='application/javascript')

    # 🔴 CRITICAL FIXES
    response['Cache-Control'] = 'no-cache'
    response['Service-Worker-Allowed'] = '/'

    return response        
        

