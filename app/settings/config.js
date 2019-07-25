(function () {
    'use strict';

    angular
        .module('app')
        .config(Configuration);
var color = '452562';
    Configuration.$inject = ['$mdThemingProvider', '$httpProvider'];

    function Configuration($mdThemingProvider, $httpProvider) {

        $mdThemingProvider.definePalette('green-lighten', {
            '50': 'ffffff',
            '100': 'e1f9f5',
            '200': 'b3f0e5',
            '300': '77e4d0',
            '400': '5edfc8',
            '500': color,
            '600': '2ad5b6',
            '700': '25bca1',
            '800': '20a28b',
            '900': '1b8975',
            'A100': 'ffffff',
            'A200': 'e1f9f5',
            'A400': '5edfc8',
            'A700': '25bca1',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50', '100', '200', '300', '400', '500', '600', '700', 'A100', 'A200', 'A400', 'A700']
        });

        $mdThemingProvider.definePalette('green-darken', {
            '50': '#def7f5',
            '100': '#a0e9e2',
            '200': '#72dfd4',
            '300': '#38d1c3',
            '400': '#2cbfb1',
            '500': '#'+color,
            '600': '#208d83',
            '700': '#1b746c',
            '800': '#155b55',
            '900': '#0f423e',
            'A100': '#def7f5',
            'A200': '#a0e9e2',
            'A400': '#2cbfb1',
            'A700': '#1b746c',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50', '100', '200', '300', '400', 'A100', 'A200', 'A400']
        });

        $mdThemingProvider.definePalette('purple-lighten', {
            '50': '#dfb3eb',
            '100': '#c577db',
            '200': '#b24acf',
            '300': '#8c2ca6',
            '400': '#77258e',
            '500': '#'+color,
            '600': '#4f195e',
            '700': '#3a1246',
            '800': '#260c2d',
            '900': '#120615',
            'A100': '#dfb3eb',
            'A200': '#c577db',
            'A400': '#77258e',
            'A700': '#3a1246',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50', '100', 'A100', 'A200']
        });

        $mdThemingProvider.definePalette('purple-darken', {
            '50': '#cd85f4',
            '100': '#b13fee',
            '200': '#9914e1',
            '300': '#6c0e9f',
            '400': '#590b83',
            '500': '#'+color,
            '600': '#33074b',
            '700': '#20042f',
            '800': '#0d0213',
            '900': '#000000',
            'A100': '#cd85f4',
            'A200': '#b13fee',
            'A400': '#590b83',
            'A700': '#20042f',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50', 'A100']
        });

        $mdThemingProvider.definePalette('blue-darken', {
            '50': '#f6f9fc',
            '100': '#bfd0e6',
            '200': '#97b2d7',
            '300': '#638bc3',
            '400': '#4d7bba',
            '500': '#'+color,
            '600': '#385e92',
            '700': '#30507c',
            '800': '#274166',
            '900': '#1f3350',
            'A100': '#f6f9fc',
            'A200': '#bfd0e6',
            'A400': '#4d7bba',
            'A700': '#30507c',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50', '100', '200', '300', 'A100', 'A200']
        });

        $mdThemingProvider.definePalette('blue-lighten', {
            '50': '#ffffff',
            '100': '#e6ebf3',
            '200': '#c0cde1',
            '300': '#8fa7ca',
            '400': '#7b96c0',
            '500': '#'+color,
            '600': '#5276ac',
            '700': '#486897',
            '800': '#3e5982',
            '900': '#344b6d',
            'A100': '#ffffff',
            'A200': '#e6ebf3',
            'A400': '#7b96c0',
            'A700': '#486897',
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50', '100', '200', '300', '400', '500', 'A100', 'A200', 'A400']
        });

        // $mdThemingProvider.definePalette('grey', {
        //     '50': '#ffffff',
        //     '100': '#ffffff',
        //     '200': '#ffffff',
        //     '300': '#ededec',
        //     '400': '#dededd',
        //     '500': '#cfcfcd',
        //     '600': '#c0c0bd',
        //     '700': '#b1b1ae',
        //     '800': '#a2a29e',
        //     '900': '#93938f',
        //     'A100': '#ffffff',
        //     'A200': '#ffffff',
        //     'A400': '#dededd',
        //     'A700': '#b1b1ae',
        //     'contrastDefaultColor': 'light',
        //     'contrastDarkColors': ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', 'A100', 'A200', 'A400', 'A700']
        // });

        $mdThemingProvider.theme('default')
            .primaryPalette('purple-lighten', {
                'default': '500', // by default use shade 400 from the pink palette for primary intentions
                'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
            })
            .accentPalette('green-lighten', {
                'default': '500', // by default use shade 400 from the pink palette for primary intentions
                'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
            })
            .warnPalette('red')
            .backgroundPalette('grey');

        $httpProvider.interceptors.push('httpInterceptorService');
    }
})();