Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  get "/api/users", to:"users#index"
  post "/api/auth/register", to:"auth#register"
  post "/api/auth/login", to:"auth#login"

  # post "/api/user/create", to:"users#create"
  # get "/api/user/all", to:"users#getAllUser"
  # patch "/api/user/update/:id", to:"users#updateUser"
  # delete "/api/user/delete/:id", to:"users#deleteUser"

  scope "/api" do
    resources :users
    resources :artists
    resources :musics
  end
end
