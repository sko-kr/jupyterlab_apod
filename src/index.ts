import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';

import { ICommandPalette, MainAreaWidget } from '@jupyterlab/apputils';

import { Widget } from '@lumino/widgets';
import { createRandomDate } from './utils/createRandomDate';

interface ApodResponse {
  copyright: string;
  date: string;
  explanation: string;
  media_type: 'video' | 'image';
  title: string;
  url: string;
}

/**
 * Initialization data for the jupyterlab_apod extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_apod:plugin',
  autoStart: true,
  requires: [ICommandPalette],
  activate: async (app: JupyterFrontEnd, palette: ICommandPalette) => {
    console.log('JupyterLab extension jupyterlab_apod is activated!');
    const content = new Widget();
    const widget = new MainAreaWidget({ content });
    widget.id = 'apod-jupyterlab';
    widget.title.label = 'Astronomy Picture';
    widget.title.closable = true;

    const img = document.createElement('img');
    content.node.appendChild(img);
    const randDate = createRandomDate(new Date(2010, 1, 1), new Date());

    const response = await fetch(`https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY&date=${randDate}`);
    const data: ApodResponse = await response.json();

    if (data.media_type === 'image') {
      img.src = data.url;
      img.title = data.title;
    } else {
      console.log('Random APOD was not a picture.');
    }

    const command = 'apod:open';
    app.commands.addCommand(command, {
      label: 'Random Astronomy Picture2',
      execute: () => {
        if (!widget.isAttached) {
          app.shell.add(widget, 'main');
        }
        app.shell.activateById(widget.id);
      }
    });
    palette.addItem({ command, category: 'Tutorial' });
    app.started.then(() => {
      /** TODO remove. app.shell.add have to wait for few more seconds for it to be added to main
       * Need to find a way to listen to total load of app.
       * */
      console.log('started');
      app.shell.add(widget, 'main');
      app.shell.activateById(widget.id);
    });
  }
};

export default plugin;
