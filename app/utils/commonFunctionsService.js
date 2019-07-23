import Rainbow from 'rainbowvis.js';

const commonFunctionsService = {
    convertCoords: (coords) => {
        return {latitude : coords._latitude, longitude: coords._longitude}
    },
    createLineGradient: (count) => {
        const rainbow = new Rainbow();
        rainbow.setNumberRange(1, count);
        rainbow.setSpectrum('#6bddf2', '#6879f1');
        const result = [];
        for (let i = 1; i <= count; i++) {
            const hexColour = rainbow.colourAt(i);
            result.push('#' + hexColour);
        }
        return result;
    }
};
export default commonFunctionsService;
