// 校验文件后缀 @/assets/img/zip_icon.png
export const isFileSuffixTool = {
  file: {
    excel: require('../assets/img/excel.jpeg'),
    pdf: require('../assets/img/pdf.jpg'),
    txt: require('../assets/img/txt.jpeg'),
    zip: require('../assets/img/zip_icon.png'),
    doc: require('../assets/img/doc.jpg'),
    font: require('../assets/img/front.png'),
  },
  pass_suffix: {
    excel: ['csv', 'xls', 'xlsx'],
    pdf: ['pdf'],
    txt: ['txt'],
    zip: ['zip', 'rar'],
    doc: ['docx', 'doc'],
    font: ['ttf', 'otf'],
  },
  fields: function() {
    return [...this.pass_suffix.excel, ...this.pass_suffix.pdf, ...this.pass_suffix.txt, ...this.pass_suffix.zip, ...this.pass_suffix.doc, ...this.pass_suffix.font];
  },
  // 是否存在指定后缀 true=存在，false=不存在
  isCheckSuffix: function(url) {
    let suffix = this.suffix(url?.toLowerCase());
    return this.fields().includes(suffix);
  },
  // 返回后缀
  suffix: function(url) {
    if (url) {
      let arr = url.split('.');
      return arr[arr.length - 1]?.toLowerCase();
    }
  },
  // 返回指定图片
  getPic: function(url) {
    let suffix = this.suffix(url);
    let src = '';
    if (this.pass_suffix.excel.includes(suffix)) {
      src = this.file.excel;
    }
    if (this.pass_suffix.pdf.includes(suffix)) {
      src = this.file.pdf;
    }
    if (this.pass_suffix.txt.includes(suffix)) {
      src = this.file.txt;
    }
    if (this.pass_suffix.zip.includes(suffix)) {
      src = this.file.zip;
    }
    if (this.pass_suffix.doc.includes(suffix)) {
      src = this.file.doc;
    }
    if (this.pass_suffix.font.includes(suffix)) {
      src = this.file.font;
    }
    return src;
  },
};

export const uuid = () => {
  let S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  };
  // Generate a pseudo-GUID by concatenating random hexadecimal.
  return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
};
