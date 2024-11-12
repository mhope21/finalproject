Rails.application.routes.draw do
  get "/current_user", to: "current_user#index"
  post 'webhooks/stripe', to: 'webhooks#stripe'
  devise_for :users, path: "", path_names: {
    sign_in: "login",
    sign_out: "logout",
    registration: "signup"

  },
  controllers: {
    sessions: "users/sessions",
    registrations: "users/registrations"
  }
  # API routes
  namespace :api do
    namespace :v1 do
      # Special routes for the dashboard cards and editing only kit items
      get "admin_dashboard", to: "admin_dashboard#index"
      get "kit_items_only", to: "kit_items#index_kit_items_only"
      post "kit_items_only", to: "kit_items#create_kit_items_only"
      patch "kit_items_only/:id", to: "kit_items#update_kit_items_only"
      post 'create-checkout-session', to: 'checkout#create'
      get 'checkout-session/:id', to: 'checkout#show'
      resources :users
      resources :donations do
        collection do
          get 'success'
          get 'cancel'
        end
      end
      resources :contacts
      resources :kit_requests, only: [ :index, :create, :show, :update, :destroy ] do
        collection do
          get "current", to: "kit_requests#current"
        end
      end
      resources :kits do
        resources :kit_items do
          member do
            # Special route for adding item to kit
            post "add_to_kit", to: "kit_items#add_to_kit"
          end
        end
      end
    end
  end

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"
end
