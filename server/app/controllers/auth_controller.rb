class AuthController < ApplicationController
    include JwtHelper

    before_action :is_role_super_admin, only: [:register]

    def register
        @user = User.new(user_params)
        if @user.save
          accessToken = encodeUser(@user)
          render json: {message: "User created successfully", token: accessToken}, status: :created
        else
          render json: {message: "Unable to create user", errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
    end

    def login
      loginParams = params.require("user").permit(:email, :password) 
      user = User.find_by(email: loginParams[:email])  
    
      if user && user.authenticate(loginParams[:password]) 
        render json: {message: "login successful", token: encodeUser(user) }, status: :ok
      else
        render json: {message: "Invalid email or password"}, status: :unauthorized
      end
    end

    private
    def is_role_super_admin
        role = params[:user][:role]
        if role != "super_admin"
          render json: { message: "Permission Denied" }, status: :forbidden 
          return
        end
      end

    private
    def user_params
        params.require("user").permit(:firstname, :lastname, :email, :password, :phone, :dob, :gender, :address, :role)
    end

    private 
    def encodeUser(user)
      accessToken = encode_token({
          user_id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          dob: user.dob,
          gender: user.gender,
          address: user.address,
          role: user.role
        })
        accessToken
    end
end
