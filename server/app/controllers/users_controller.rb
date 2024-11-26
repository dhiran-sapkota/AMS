class UsersController < ApplicationController

    include AuthenticationConcern

    before_action :authorizeSuperAdmin


    def create 
        @user = User.new(user_params)
        @user.created_by = @currentUser["user_id"]

        if @user[:role] != "artist_manager"
            render json: {message: "cannot create user with that role"}, status: :unauthorized
            return
        end

        if @user.save
          render json: {message: "User created successfully"}, status: :created
        else
          render json: {message: "Unable to create user", errors: @user.errors.full_messages }, status: :unprocessable_entity
        end
    end


    def index     
        if @currentUser["role"] != "super_admin"
            render json: {message: "permission denied"}, status: :unauthorized
            return
        end
        limit = params.fetch(:limit, 5)
        offset = params.fetch(:offset, 0)
        begin
            users = User.where("created_by = ?", @currentUser["user_id"]).where("role = 1").select("#{(User.column_names - ["password_digest"]).join(", ")}")

            if params[:query].present?
                users = users.where("firstname LIKE ? OR lastname LIKE ?", "%#{params[:query]}%", "%#{params[:query]}%")
            end
        
              if params[:sort_by].present?
                allowed_sort_columns = ['created_at', 'firstname', 'lastname', "email", "phone", "address"] 
                sort_column = allowed_sort_columns.include?(params[:sort_by]) ? params[:sort_by] : 'created_at'
                sort_order = params[:sort_order] == 'desc' ? 'desc' : 'asc' 
                users = users.order("#{sort_column} #{sort_order}")
              else
                users = users.order(created_at: :desc)
              end
              
              totalCount = users.length
        
              users = users.limit(limit).offset(offset)
            
            render json: { message: "Users retrieved successfully", data: users, total: totalCount }, status: :ok
        rescue => e
            render json: { message: e }
        end 
    end

    def update
        user = User.find_by(id: params[:id])
        if !user 
            render json: {message: "User does not exist with that id"}, status: :not_found
            return
        end
        if user[:created_by] != @currentUser["user_id"]
            render json: {message: "can not update user"}, status: :unauthorized
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

    def destroy
        begin
            user = User.find_by(id: params[:id])
            if !user 
                render json: {message: "User does not exist with that id"}, status: :not_found
                return
            end
            if user[:created_by] != @currentUser["user_id"]
                render json: {message: "can not update user"}, status: :unauthorized
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
            render json: { message: "not allowed" }, status: :unauthorized
        end
    end

    private
    def user_params
        params.require("user").permit(:firstname, :lastname, :email, :password, :phone, :dob, :gender, :address, :role)
    end
end
