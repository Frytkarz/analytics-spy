export interface MetaInfo {
    Timestamp: Date;
}

export interface MatchQuality {
    Country: number;
    City: number;
}

export interface DisplayPosition {
    Latitude: number;
    Longitude: number;
}

export interface NavigationPosition {
    Latitude: number;
    Longitude: number;
}

export interface TopLeft {
    Latitude: number;
    Longitude: number;
}

export interface BottomRight {
    Latitude: number;
    Longitude: number;
}

export interface MapView {
    TopLeft: TopLeft;
    BottomRight: BottomRight;
}

export interface AdditionalData {
    value: string;
    key: string;
}

export interface Address {
    Label: string;
    Country: string;
    State: string;
    City: string;
    PostalCode: string;
    AdditionalData: AdditionalData[];
}

export interface Location {
    LocationId: string;
    LocationType: string;
    DisplayPosition: DisplayPosition;
    NavigationPosition: NavigationPosition[];
    MapView: MapView;
    Address: Address;
}

export interface Result {
    Relevance: number;
    MatchLevel: string;
    MatchQuality: MatchQuality;
    Location: Location;
}

export interface View {
    _type: string;
    ViewId: number;
    Result: Result[];
}

export interface Response {
    MetaInfo: MetaInfo;
    View: View[];
}

export interface GeoCode {
    Response: Response;
}