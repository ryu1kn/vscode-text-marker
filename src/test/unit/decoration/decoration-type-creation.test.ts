import DecorationTypeCreator from '../../../lib/decoration/decoration-type-creator';
import {OverviewRulerLane} from 'vscode';
import {contains, mock, mockType, verify} from '../../helpers/mock';
import ConfigStore from '../../../lib/config-store';
import WindowComponent from '../../../lib/vscode/window';

suite('Decoration type creation', () => {

    const configStore = mockType<ConfigStore>({defaultHighlightOpacity: 0.5});
    let window: WindowComponent;
    let creator: DecorationTypeCreator;

    setup(() => {
        window = mock(WindowComponent);
        creator = new DecorationTypeCreator(configStore, window);
    });

    test('converts a colour to RGB and give the opacity', () => {
        creator.create('blue');

        verify(window.createTextEditorDecorationType({
            backgroundColor: 'rgba(0,0,255,0.5)',
            borderRadius: '.2em',
            overviewRulerColor: 'violet',
            overviewRulerLane: OverviewRulerLane.Center
        }));
    });

    test('use the user input if the colour already has the opacity', () => {
        creator.create('rgba(0,0,255,1)');

        verify(window.createTextEditorDecorationType(contains({backgroundColor: 'rgba(0,0,255,1)'})));
    });

    test('use the user input if the colour already has the opacity in HSL space', () => {
        creator.create('hsla(240,100%,50%,1)');

        verify(window.createTextEditorDecorationType(contains({backgroundColor: 'hsla(240,100%,50%,1)'})));
    });

    test('use the user input if the colour is given as captial RGBA value', () => {
        creator.create('RGBA(0,0,255,1)');

        verify(window.createTextEditorDecorationType(contains({backgroundColor: 'RGBA(0,0,255,1)'})));
    });

    test('use the user input if it failed to convert to RGB value', () => {
        creator.create('invalid_colour');

        verify(window.createTextEditorDecorationType(contains({backgroundColor: 'invalid_colour'})));
    });
});
