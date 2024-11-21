class MusicsController < ApplicationController
    include AuthenticationConcern
  
    before_action :check_artist_permission, only: [:create, :update, :destroy]
    before_action :set_music, only: [:update, :destroy]

  
    def index
      artistId = params[:id]
      if artistId.blank?
        render json: { message: "Artist ID is required" }, status: :bad_request
        return
      end

      limit = params.fetch(:limit, 5)
      offset = params.fetch(:offset, 0)
      
      musics = Music.where(user_id: artistId)
      if params[:query].present?
        musics = musics.where("title LIKE ?", "%#{params[:query]}%")
      end

      if params[:sort_by].present?
        allowed_sort_columns = ['created_at', 'title', 'updated_at'] 
        sort_column = allowed_sort_columns.include?(params[:sort_by]) ? params[:sort_by] : 'created_at'
        sort_order = params[:sort_order] == 'desc' ? 'desc' : 'asc' 
        musics = musics.order("#{sort_column} #{sort_order}")
      else
        musics = musics.order(created_at: :desc)
      end

      totalCount = musics.length
      musics = musics.limit(limit).offset(offset)

      render json: {message:"Musics retrieved successfully", data: musics, total: totalCount }, status: :ok
    end
  
    def create
      music_params_with_user = music_params.merge(user_id: @currentUser["user_id"])
      newMusic = Music.new(music_params_with_user)
  
      if newMusic.save
        render json: { message: "Music created successfully", music: newMusic, success: true }, status: :created
      else
        render json: { error: "Validation failed", message: newMusic.errors.full_messages, success: false }, status: :unprocessable_entity
      end
    end
  
    def destroy
      if @music
        @music.destroy
        render json: { message: "Music deleted successfully" }, status: :ok
      else
        render json: { message: "Cannot find music with that ID" }, status: :not_found
      end
    end
  
    def update
      if @music
        if @music[:user_id] != @currentUser["user_id"]
          render json: { message: "not allowed to update music"}, status: :forbidden
        end        
        if @music.update(music_params)
          render json: { message: "Music updated successfully", music: @music }, status: :ok
        else
          render json: { error: "Validation failed", message: @music.errors.full_messages }, status: :unprocessable_entity
        end
      else
        render json: { message: "Cannot find music with that ID" }, status: :not_found
      end
    end
  
    private
  
    def check_artist_permission
      unless isAllowedAction(["artist"])
        render json: { message: "Permission denied, only artists can perform this action" }, status: :forbidden
      end
    end
  
    def set_music
      @music = Music.find_by(id: params[:id])

      if @music[:user_id] != @currentUser["user_id"]
        render json: { message: "not allowed to update music"}, status: :forbidden
        nil
      end
    end
  
    def isAllowedAction(roles)
      roles.include?(@currentUser["role"])
    end
  
    def music_params
      begin
        params.require(:music).permit(:title, :album_name, :genre)
      rescue ActionController::ParameterMissing => e
        render json: { error: "Missing required parameter", message: e.message }, status: :bad_request
        nil
      end
    end
    
  end
  