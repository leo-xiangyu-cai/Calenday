export default class BlockPrinter {
  private lines: string[] = [];

  private title: string = '';

  constructor(title: string = '') {
    this.title = title;
  }

  push = (line: string) => {
    this.lines.push(line);
  };

  print = () => {
    const maxWidth = Math.max(...this.lines.map((x) => x.length), this.title.length) + 4;
    let title = '';
    if ((maxWidth - this.title.length) % 2 === 0) {
      title = `+${new Array((maxWidth - this.title.length) / 2 + 1).join('-')}${this.title}${new Array((maxWidth - this.title.length) / 2 + 1).join('-')}+`;
    } else {
      title = `+${new Array(Math.floor((maxWidth - this.title.length) / 2) + 1).join('-')}${this.title}${new Array(Math.floor((maxWidth - this.title.length) / 2) + 2).join('-')}+`;
    }
    const border = `+${new Array(maxWidth + 1).join('-')}+`;
    const emptyLine = `|${new Array(maxWidth + 1).join(' ')}|`;
    // eslint-disable-next-line no-console
    console.log(title);
    // eslint-disable-next-line no-console
    console.log(emptyLine);
    for (let i = 0; i < this.lines.length; i += 1) {
      // eslint-disable-next-line no-console
      console.log(`|  ${this.lines[i]}${new Array(maxWidth - this.lines[i].length - 1).join(' ')}|`);
    }
    // eslint-disable-next-line no-console
    console.log(emptyLine);
    // eslint-disable-next-line no-console
    console.log(border);
  };
}
