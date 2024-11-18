class EventSerializer < ActiveModel::Serializer
  attributes :id, :title, :start, :end, :extendedProps

  def start
    object.start_time.iso8601  # Make sure to convert to ISO 8601 format
  end

  def end
    object.end_time.iso8601    # Make sure to convert to ISO 8601 format
  end

  def extendedProps
  {
    description: object.description,
    color: object.color
  }
  end
end
