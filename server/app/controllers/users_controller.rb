class UsersController < ApplicationController
    include JwtHelper

    before_action :getCurrentUser
    before_action :authorizeSuperAdmin


    def create 
        @user = User.new(user_params)
        @user.created_by = @currentUser["user_id"]

        if @user[:role] != "artist_manager"
            render json: {message: "cannot create user with that role"}, status: :forbidden
            return
        end

        if @user.save
          render json: {message: "User created successfully"}, status: :created
        else
          render json: {message: "Unable to create user", errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
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

    private
    def authorizeSuperAdmin
        if @currentUser["role"] != "super_admin"
            render json: { message: "not allowed" }, status: :forbiddend
        end
    end

    private
    def user_params
        params.require("user").permit(:firstname, :lastname, :email, :password, :phone, :dob, :gender, :address, :role)
    end
end
