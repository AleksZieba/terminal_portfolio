import packageJson from '../../package.json';
import themes from '../../themes.json';
import { history } from '../stores/history';
import { theme } from '../stores/theme';

const hostname = window.location.hostname;

export const commands: Record<string, (args: string[]) => Promise<string> | string> = {
  pomoc: () => 'Dostępne polecenia: ' + Object.keys(commands).join(', '),
  hostname: () => hostname + ' - Sprawdź pogodę za pomocą polecenia „pogoda” ;-)',
  o_mnie: () => 'Programista z pasją, który pracuje w: HTML, CSS, React, Javascript, Typescript, Node.js, Express.js, Git, mySQL, PostGresql, Bash, Blender, Substance Painter, Substance Designer, GCP, i Vercel',
  data: () => new Date().toLocaleString(),
  vi: () => `dlaczego używasz vi? używaj emacs`,
  vim: () => `dlaczego używasz vim? używaj emacs`,
  emacs: () => `dlaczego używasz emacs? używaj vim`,
  echo: (args: string[]) => args.join(' '),
  sudo: (args: string[]) => {
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ');

    return `Odmowa uprawnień: nie można uruchomić polecenia '${args[0]}' jako root.`;
  },
  motyw: (args: string[]) => {
    const usage = `Usage: theme [args].
    [args]:
      ls: lista wszystkich dostępnych motywów
      set: zmien motyw na [motyw]

    [Przykłady]:
      motyw ls
      motyw set dracula
    `;
    if (args.length === 0) {
      return usage;
    }

    switch (args[0]) {
      case 'ls': {
        let result = themes.map((t) => t.name.toLowerCase()).join(', ');
        result += ' to wszystko...'
          
          //`Możesz podglądąć wszystkie motywy tutaj: ${packageJson.repository.url}/tree/master/docs/themes`;

        return result;
      }

      case 'set': {
        if (args.length !== 2) {
          return usage;
        }

        const selectedTheme = args[1];
        const t = themes.find((t) => t.name.toLowerCase() === selectedTheme);

        if (!t) {
          return `Motyw '${selectedTheme}' nie znaleziono. Wypróbuj „motyw ls”, aby zobaczyć wszystkie dostępne motywy.`;
        }

        theme.set(t);

        return `Motyw zmieniony na ${selectedTheme}`;
      }

      default: {
        return usage;
      }
    }
  },
  //repo: () => {
    //window.open(packageJson.repository.url, '_blank');

    //return 'Opening repository...';
  //},
  clear: () => {
    history.set([]);

    return '';
  },
  email: () => {
    window.open(`mailto:${packageJson.author.email}`);

    return `Opening mailto:${packageJson.author.email}...`;
  },
  //donate: () => {
    //window.open(packageJson.funding.url, '_blank');

    //return 'Opening donation url...';
  //},
  pogoda: async (args: string[]) => {
    const city = args.join('+');

    if (!city) {
      return 'Zastosowanie: pogoda [miasto]. Przykład: pogoda Krakow';
    }

    const weather = await fetch(`https://wttr.in/${city}?ATm`);

    return weather.text();
  },
  exit: () => {
    return 'Aby wyjść, zamknij zakładkę.';
  },
  curl: async (args: string[]) => {
    if (args.length === 0) {
      return 'curl: nie podano URL';
    }

    const url = args[0];

    try {
      const response = await fetch(url);
      const data = await response.text();

      return data;
    } catch (error) {
      return `curl: nie można pobrać adresu URL ${url}. Szczegóły: ${error}`;
    }
  },
  banner: () => `
 _________________
| | ___________ |o|   █████╗ ██╗     ███████╗██╗  ██╗███████╗    ███████╗
| | ___________ | |  ██╔══██╗██║     ██╔════╝██║ ██╔╝██╔════╝    ╚══███╔╝
| | ___________ | |  ███████║██║     █████╗  █████╔╝ ███████╗      ███╔╝ 
| | ___________ | |  ██╔══██║██║     ██╔══╝  ██╔═██╗ ╚════██║     ███╔╝  
| |_____________| |  ██║  ██║███████╗███████╗██║  ██╗███████║    ███████╗
|    |       |   ||  ╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚══════╝    ╚══════╝
|    |       |   V|                                                © 2024
|____|_______|____| 

Wpisz „pomoc”, aby wyświetlić listę dostępnych poleceń.
`,
};
