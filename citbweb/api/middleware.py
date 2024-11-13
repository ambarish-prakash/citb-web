
class GlobalVariableMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        self.games = {}  # Store your global variables here
        self.ai_agent = None

    def __call__(self, request):
        request.games = self.games
        request.ai_agent = self.ai_agent
        response = self.get_response(request)
        return response
