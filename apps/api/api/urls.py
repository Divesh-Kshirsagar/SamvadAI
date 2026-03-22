from django.contrib import admin
from django.urls import path
from django.http import HttpResponse
from ninja import NinjaAPI
from complaints.api import router as complaints_router

def home(request):
    html = """
    <html>
        <head>
            <title>SamvadAI Backend</title>
            <style>
                body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; padding: 40px; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; }
                h1 { color: #2563eb; }
                .container { background: #f8fafc; padding: 30px; border-radius: 8px; border: 1px solid #e2e8f0; }
                a { color: #2563eb; text-decoration: none; font-weight: 500; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🚀 SamvadAI API Engine</h1>
                <p><strong>Welcome to the brain of SamvadAI!</strong></p>
                <p>This is the high-performance Django-Ninja backend powering the Union Bank complaint management dashboard.</p>
                <p>It utilizes an advanced <strong>LangGraph-based agentic pipeline</strong> to route, classify, analyze sentiment, detect duplicates, and draft responses for incoming customer complaints.</p>
                <br>
                <h3>📌 Useful Links</h3>
                <ul>
                    <li><a href="/api/docs">Interactive API Documentation (Swagger)</a></li>
                    <li><a href="/admin/">Django Admin Panel</a></li>
                </ul>
            </div>
        </body>
    </html>
    """
    return HttpResponse(html)

api = NinjaAPI(title="SamvadAI API", version="1.0.0")
api.add_router("/complaints", complaints_router)

urlpatterns = [
    path('', home),
    path('admin/', admin.site.urls),
    path('api/', api.urls),
]
