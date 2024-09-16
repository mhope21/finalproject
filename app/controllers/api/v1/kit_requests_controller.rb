class Api::V1::KitRequestsController < ApplicationController
  before_action :set_kit_request, only: %i[ show update destroy ]

  # GET /kit_requests
  def index
    @kit_requests = KitRequest.all

    render json: @kit_requests
  end

  # GET /kit_requests/1
  def show
    render json: @kit_request
  end

  # POST /kit_requests
  def create
    @kit_request = KitRequest.new(kit_request_params)

    if @kit_request.save
      render json: @kit_request, status: :created, location: @kit_request
    else
      render json: @kit_request.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /kit_requests/1
  def update
    if @kit_request.update(kit_request_params)
      render json: @kit_request
    else
      render json: @kit_request.errors, status: :unprocessable_entity
    end
  end

  # DELETE /kit_requests/1
  def destroy
    @kit_request.destroy!
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_kit_request
      @kit_request = KitRequest.find(params[:id])
    end

    # Only allow a list of trusted parameters through.
    def kit_request_params
      params.require(:kit_request).permit(:grade_level, :school_year, :teacher_id, :kit_id)
    end
end