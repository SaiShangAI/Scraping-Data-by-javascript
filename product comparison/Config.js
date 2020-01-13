exports.Local_Image_M_Path = './Image/ImageSizeL/'
exports.Local_Image_S_Path = './Image/ImageSizeS/'
exports.Local_Image_Brand_Path = './Image/BrandLogo/'

//feature group
FeatureGroup = {}
    //first special symbol: 
    //# this is number
    //$ is for vector 
    //* is for checkbox

FeatureGroup['Produkt Information'] = ['*Kategorie', '#Preis', '*Marke', '#Kundenbewertung', '$Maße', '*beutellos', '#Staubvolumen', '#Gewicht', '#Gewährleistung']
FeatureGroup['Technische Daten'] = ['#Max. Leistung', '*Anzahl der Leistungsstufen', '*Hygienische Behälterentleerung']
FeatureGroup['Merkmale'] = ['*2-in-1-Gerät', '*Leichtgewicht (<5kg)', '*Silence-System', '*Möbelschutzleiste', '*PowerProtect System', '*Tierhaarentfernung']
FeatureGroup['Akkuleistung'] = ['*Akkubetrieb', '#Akku Ladezeit', '*Akku Typ', '#Anschluss-Spannung', '*Ein-/Ausschalttaste', '#Maximale Akkulaufzeit', '#Akku-Leistung']


exports.FeatureGroup = FeatureGroup

exports.SpecialSymbolsList = ['#', '$', '*']

FeatureUnit = {}
FeatureUnit['Preis'] = '€'
FeatureUnit['Kundenbewertung'] = '★'
FeatureUnit['Maße'] = 'cm'
FeatureUnit['Staubvolumen'] = 'Liter'
FeatureUnit['Gewährleistung'] = 'Jahre'
FeatureUnit['Gewicht'] = 'kg'
FeatureUnit['Anschluss-Spannung'] = 'Volt'
FeatureUnit['Max. Leistung'] = 'Watt'
FeatureUnit['Akku Ladezeit'] = 'Stunden'
FeatureUnit['Akku-Leistung'] = 'Volt'
FeatureUnit["Maximale Akkulaufzeit"] = 'Minuten'
exports.FeatureUnit = FeatureUnit