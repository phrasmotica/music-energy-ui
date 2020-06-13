/// <summary>
/// Model for responses.
/// </summary>
export class TrackResponse
{
    // Gets or sets the ID of the track.
    id?: string

    // Gets or sets the acousticness of the track.
    acousticness?: number

    // Gets or sets the danceability of the track.
    danceability?: number

    // Gets or sets the energy of the track.
    energy?: number

    // Gets or sets the instrumentalness of the track.
    instrumentalness?: number

    // Gets or sets the liveness of the track.
    liveness?: number

    // Gets or sets the normalised loudness of the track.
    normalisedLoudness?: number

    // Gets or sets the speechiness of the track.
    speechiness?: number

    // Gets or sets the valence of the track.
    valence?: number

    // Gets or sets the Monday energy score of the track.
    mondayEnergy?: number

    // Gets or sets the Tuesday energy score of the track.
    tuesdayEnergy?: number

    // Gets or sets the Wednesday energy score of the track.
    wednesdayEnergy?: number

    // Gets or sets the Thursday energy score of the track.
    thursdayEnergy?: number

    // Gets or sets the Friday energy score of the track.
    fridayEnergy?: number


    constructor(
        id?: string,
        acousticness?: number,
        danceability?: number,
        energy?: number,
        instrumentalness?: number,
        liveness?: number,
        normalisedLoudness?: number,
        speechiness?: number,
        valence?: number,
        mondayEnergy?: number,
        tuesdayEnergy?: number,
        wednesdayEnergy?: number,
        thursdayEnergy?: number,
        fridayEnergy?: number,
    ) {
        this.id = id
        this.acousticness = acousticness
        this.danceability = danceability
        this.energy = energy
        this.instrumentalness = instrumentalness
        this.liveness = liveness
        this.normalisedLoudness = normalisedLoudness
        this.speechiness = speechiness
        this.valence = valence
        this.mondayEnergy = mondayEnergy
        this.tuesdayEnergy = tuesdayEnergy
        this.wednesdayEnergy = wednesdayEnergy
        this.thursdayEnergy = thursdayEnergy
        this.fridayEnergy = fridayEnergy
    }


    static from(trackData: TrackResponse) {
        return new TrackResponse(
            trackData.id,
            trackData.acousticness,
            trackData.danceability,
            trackData.energy,
            trackData.instrumentalness,
            trackData.liveness,
            trackData.normalisedLoudness,
            trackData.speechiness,
            trackData.valence,
            trackData.mondayEnergy,
            trackData.tuesdayEnergy,
            trackData.wednesdayEnergy,
            trackData.thursdayEnergy,
            trackData.fridayEnergy,
        )
    }
}