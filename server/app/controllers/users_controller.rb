class UsersController < ApplicationController

    include AuthenticationConcern

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


    def getAllUser     
        if @currentUser["role"] != "super_admin"
            render json: {message: "permission denied"}, status: :forbidden
            return
        end
        begin
            user = User.where("created_by = ?", @currentUser["user_id"]).where("role = 1")
            render json: { users: user }, status: :ok
        rescue => e
            render json: { message: e }
        end 
    end

    def updateUser
        user = User.find_by(id: params[:id])
        if !user 
            render json: {message: "User does not exist with that id"}, status: :not_found
            return
        end
        if user[:created_by] != @currentUser["user_id"]
            render json: {message: "can not update user"}, status: :forbidden
            return
        end 
        
        begin
            user.update(user_params)
            if user.save
                render json: {message: "User updated successfully"}
            else 
                render json: {message: "Unable to update user", errors: user.errors.full_messages }, status: :unprocessable_entity
            end

        rescue => e
            render json: { message: e }
        end
    end

    def deleteUser
        begin
            user = User.find_by(id: params[:id])
            if !user 
                render json: {message: "User does not exist with that id"}, status: :not_found
                return
            end
            if user[:created_by] != @currentUser["user_id"]
                render json: {message: "can not update user"}, status: :forbidden
                return
            end 

            user.destroy
            render json: {message: "User deleted successfully"}

        rescue => e
            render json: { message: e }
        end
    end

    private
    def authorizeSuperAdmin
        if @currentUser["role"] != "super_admin"
            render json: { message: "not allowed" }, status: :forbidden
        end
    end

    private
    def user_params
        params.require("user").permit(:firstname, :lastname, :email, :password, :phone, :dob, :gender, :address, :role)
    end
end
