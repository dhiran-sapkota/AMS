class ArtistsController < ApplicationController

    include AuthenticationConcern

    def index
        unless isAllowedAction(["artist_manager", "super_admin"])
            render json: { message: "permission denied" }, status: :forbidden
            return
        end
        
        if @currentUser["role"] == "artist_manager"
        
            allArtists = Artist.find_by_sql([
                "SELECT artists.*, #{
                  (User.column_names - ["password_digest"]).map{
                  |col| "users.#{col}"
                }.join(", ")
                }
                 FROM artists INNER JOIN users ON artists.user_id = users.id
                 WHERE users.created_by = ?
                ",
                [@currentUser["user_id"]]
              ])
            render json: { artists: allArtists }, status: :ok
        else
            allArtists = Artist.find_by_sql(
                [
                    "SELECT artists.*, #{
                        (User.column_names - ["password_digest"]).map{
                        |col| "users.#{col}"
                      }.join(", ")
                      }
                     FROM artists
                     INNER JOIN users ON artists.user_id = users.id
                     WHERE users.role = '2' AND users.created_by IN (
                        SELECT id
                        FROM users
                        WHERE users.created_by = ?
                     ) 
                    ",
                    @currentUser["user_id"]
                ]
            )
            render json: { artists: allArtists }, status: :ok            
        end
    end

    def show
        if @currentUser["role"] == "artist"
            artist = Artist.joins(:user).where(user_id: @currentUser["user_id"]).first
            render json: artist , status: :ok
        elsif  @currentUser["role"] == "artist_manager"
            artist = Artist.find_by_sql(
                [
                    "SELECT artists.*, users.*
                     FROM artists
                     INNER JOIN users ON artists.user_id = users.id
                     WHERE users.created_by = ? AND users.id = ?
                    ",
                    [@currentUser["user_id"], params[:id]]
                ], 
            )

            unless artist
                render json: { message: "can not get artist with that id" }, status: :unprocessable_entity
                return 
            end
            render json: artist, status: :ok
        else 
            artist = Artist.find_by_sql(
                [
                    "SELECT artists.*, users.*
                     FROM artists
                     INNER JOIN users ON artists.user_id = users.id
                     WHERE users.id = ? AND user.id IN (
                        SELECT id
                        FROM users
                        WHERE users.created_by = ?
                     )
                    ",
                    [params[:id], @currentUser["user_id"]]
                ], 
            )

            unless artist
                render json: { message: "can not get artist with that id" }, status: :unprocessable_entity
                return 
            end
            render json: artist, status: :ok
        end 
    end

    def update
        unless isAllowedAction(["artist_manager"])
            render json: { message: "permission denied" }, status: :forbidden
            return
        end

        artist = Artist.find_by_sql(
            [
                "SELECT artists.*, users.*
                 FROM artists
                 INNER JOIN users IN artists.user_id = users.id
                 WHERE users.created_by = ? AND users.id = ?
                ",
                [@currentUser["user_id"], params[:id]]
            ]
        )  
        
        unless artist
            render json: { message: "can not edit artist" }, status: :unprocessable_entity
            return 
        end

        allparams = artist_params
        allparams.delete(:password) if allparams.key?(:password)
        
    end

    def destroy
        unless isAllowedAction(["artist_manager"])
            render json: { message: "permission denied" }, status: :forbidden
            return
        end

        artist = Artist.find_by_sql(
                "SELECT artists.*, users.*
                 FROM artists
                 INNER JOIN users ON artists.user_id = users.id
                 WHERE users.created_by = ? AND users.id = ?",
 
            [@currentUser["user_id"], params[:id]]
        ).first

        unless artist
            render json: { message: "Cannot delete artist" }, status: :unprocessable_entity
            return
          end
          
        unless artist.destroy
            render json: { message: "artist deletion failed", errors: artist.errors.full_messages }, status: :unprocessable_entity
            return
        end
        render json: { message: "artist deleted successfully" }, status: :ok
        
    end

    def create
        if !isAllowedAction(["artist_manager"])
            render json: { message: "permission denied, only artist manager can create artists" }, status: :forbidden
            return
        end

        ActiveRecord::Base.transaction do
        @user = User.new(
            "firstname": artist_params[:firstname],
            "lastname": artist_params[:lastname],
            "email": artist_params[:email],
            "password": artist_params[:password],
            "phone": artist_params[:phone],
            "dob": artist_params[:dob],
            "gender": artist_params[:gender],
            "address": artist_params[:address],
            "role": "artist"
        )
        @user.created_by = @currentUser["user_id"]

        unless @user.save
            raise ActiveRecord::Rollback, "#{user.errors.full_messages.join(', ')}"
        end
        
        @artist = Artist.new(
            "no_of_albums_released": artist_params[:no_of_albums_released],
            "first_release_year": artist_params[:first_release_year],
            "user_id":  @user[:id]
        )
        unless @artist.save
            raise ActiveRecord::Rollback, "#{user.errors.full_messages.join(', ')}"
        end        
        render json: {message: "Artist created successfully" }, status: :created
    end
    rescue => e
        render json: { message: 'Transaction failed', errors: e.message }, status: :unprocessable_entity
    end



    private 
    def isAllowedAction(roles)
        allowed = false
        roles.include?(@currentUser["role"])
    end

    private
    def artist_params
        params.require("artist").permit(:firstname, :lastname, :email, :password, :phone, :dob, :gender, :address, :no_of_albums_released, :first_release_year)
    end

end
