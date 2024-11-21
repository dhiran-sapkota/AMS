class ArtistsController < ApplicationController

    include AuthenticationConcern

    before_action :allow_artist_manager, only: [:update, :destroy, :create]
    before_action :allow_artist_manager_or_super_admin, only: [:index]


    def index

        limit = params.fetch(:limit, 5)
        offset = params.fetch(:offset, 0)

        if @currentUser["role"] == "artist_manager"
            allArtists = Artist.joins(:user)
            .where("users.role = '2'")
            .where("users.created_by = ?", @currentUser["user_id"])
            .select("artists.*, #{(User.column_names - ["password_digest"]).map{ |col| "users.#{col}" }.join(", ")}")
            
            if params[:query].present?
                allArtists = allArtists.where("users.firstname LIKE ? OR users.lastname LIKE ?", "%#{params[:query]}%", "%#{params[:query]}%")
            end

            totalCount = allArtists.length
            allArtists = allArtists.limit(limit).offset(offset)

            render json: { message: "All artists retrieved successfully", data: allArtists, total: totalCount }, status: :ok
        else
            allArtists = Artist.joins(:user)
            .where("users.role = '2'")
            .where("users.created_by IN (SELECT id FROM users WHERE users.created_by = ?)", @currentUser["user_id"])
            .select("artists.*, #{(User.column_names - ["password_digest"]).map{ |col| "users.#{col}" }.join(", ")}")

            if params[:query].present?
                allArtists = allArtists.where("users.firstname LIKE ? OR users.lastname LIKE ?", "%#{params[:query]}%", "%#{params[:query]}%")
            end

            totalCount = allArtists.length
            allArtists = allArtists.limit(limit).offset(offset)

            render json: { message: "All artists retrieved successfully", data: allArtists, total: totalCount }, status: :ok            
        end
    end

    def update
        artist = Artist.find_by_sql(
                "SELECT artists.*, users.*
                 FROM artists
                 INNER JOIN users ON artists.user_id = users.id
                 WHERE users.created_by = ? AND users.id = ?
                ",
                [@currentUser["user_id"], params[:id]]
            
        ).first
        
        unless artist
            render json: { message: "can not edit artist" }, status: :unprocessable_entity
            return 
        end

        ActiveRecord::Base.transaction do
            realartist = Artist.find_by(user_id: params[:id])
            realartist.update!(artist_params)

            artist.user.update!(user_params)

            render json: {
                message: "Artist updated successfully",
            }
        end
    rescue => e
        render json: { message: 'Transaction failed', errors: e.message }, status: :unprocessable_entity
    end

    def destroy
        artist = Artist.find_by_sql(
                "SELECT artists.*, users.*
                 FROM artists
                 INNER JOIN users ON artists.user_id = users.id
                 WHERE users.created_by = ? AND artists.id = ?",
 
            [@currentUser["user_id"], params[:id]]
        ).first

        unless artist
            render json: { message: "Cannot delete artist" }, status: :unprocessable_entity
            return
        end
          
        newartist = Artist.find(params[:id])
        unless newartist.destroy
            render json: { message: "artist deletion failed", errors: artist.errors.full_messages }, status: :unprocessable_entity
            return
        end
        render json: { message: "artist deleted successfully" }, status: :ok
    end

    def create
        ActiveRecord::Base.transaction do
            user = User.create!(user_params.merge(role: "artist", created_by: @currentUser["user_id"]))
            artist = Artist.create!(artist_params.merge(user_id: user.id))
    
            render json: { 
              message: "Artists created successfully",
              data: user.attributes.merge(
                first_release_year: artist.first_release_year,
                no_of_albums_released: artist.no_of_albums_released
              )
            }, status: :created
    end
    rescue => e
        render json: { message: 'Transaction failed', errors: e.message }, status: :unprocessable_entity
    end

    private
    def allow_artist_manager
        isAllowedAction(["artist_manager"])
    end
      
    private
    def allow_artist_manager_or_super_admin
      isAllowedAction(["artist_manager", "super_admin"])
    end

    private 
    def isAllowedAction(roles)
        roles.include?(@currentUser["role"])
    end

    private
    def artist_params
        params.require("artist").permit(:no_of_albums_released, :first_release_year)
    end 

    private 
    def user_params
        params.require("artist").permit(:firstname, :lastname, :email, :password, :phone, :dob, :gender, :address)
    end

end
