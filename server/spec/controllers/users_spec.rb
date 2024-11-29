require "rails_helper"

RSpec.describe UsersController, type: :controller do
  include JwtHelper
  let!(:fake_user) { create(:user) }
  let (:valid_token) {encode_token({
          user_id: :fake_user["id"],
          firstname: :fake_user["firstname"],
          lastname: :fake_user["lastname"],
          email: :fake_user["email"],
          phone: :fake_user["phone"],
          dob: :fake_user["dob"],
          gender: :fake_user["gender"],
          address: :fake_user["address"],
          role: "super_admin"
        })}
        
  describe "unauthenticated users" do
    it "should deny access to unauthenticated users to perform actions" do
      Rails.logger.debug "Starting the POST #create test"
      get :index
      expect(response).to have_http_status(:forbidden)
      post :create, params: {user: attributes_for(:user)}
      expect(response).to have_http_status(:forbidden)

      patch :update, params: {firstname: "random", id: 1}
      expect(response).to have_http_status(:forbidden)

      delete :destroy, params: {id: 1}
      expect(response).to have_http_status(:forbidden)
    end
  end
  describe "POST #user" do
    before do
      request.headers["Authorization"] = "Bearer #{valid_token}"
    end
    it("allows super admin to create a user") do
      post :create, params: { user: attributes_for(:user, email:"anotherone@email.com") }
      expect(response).to have_http_status(:created)
    end

    it("only artist manager is allowed to created") do
      post :create, params: { user: attributes_for(:user, email:"anotherone@email.com", role:"super_admin") }
      expect(response).to have_http_status(:unauthorized)
    end

    it("Should not create a user if any required parameters are missing") do
      post :create, params: { user: attributes_for(:user, email:nil) }
      json_response = JSON.parse(response.body)
      expect(json_response["errors"]).to include("Email can't be blank")
    end
  end

  describe "UPDATE #user" do
    before do
      request.headers["Authorization"] = "Bearer #{valid_token}"
    end
    update_payload = {
        firstname: "changed firstname"
    }
    it("allows super admin to update a user") do
      patch :update, params: { user: update_payload, id: 1 }
      expect(response).to have_http_status(:ok)
    end
  end

  describe "DELETE #user" do
    before do
      request.headers["Authorization"] = "Bearer #{valid_token}"
    end
    it("allows super admin to delete a user") do
      delete :destroy, params: { id:1 }
      expect(response).to have_http_status(:ok)
    end
  end
end