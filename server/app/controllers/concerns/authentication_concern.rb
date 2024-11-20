module AuthenticationConcern
    extend ActiveSupport::Concern

    include JwtHelper

    included do
        before_action :getCurrentUser 
    end
    
    private
    def getCurrentUser
        token = request.headers["Authorization"]&.split(" ")&.last
        if token
            @currentUser = decode_token(token)
            if !@currentUser
                render json: { message: "invalid token"}, status: :unauthorized
            end    
        else
            render json: { message: "token missing"}, status: :unauthorized
        end 
    end 
end