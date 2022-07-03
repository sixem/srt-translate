<h1 align="center">srt-translate</h1>

<p align="center">A package that translates .srt files using Google Cloud Translate.</p>

# Usage

## Command Line (CLI):

#### Install the package globally:
```bash
sudo npm install -g srt-translate
```
#### Usage:
```bash
srt-translate --key "one-drive-000000-00000x00xxxx.json" --input source.srt --output output.srt --target en
```

## Node:
#### Install the package:
```bash
sudo npm install srt-translate
```

#### Usage:
```js
/* Import the package */
import srtTranslate from 'srt-translate';

/* Create a class instance */
let translate = new srtTranslate({
    key: 'one-drive-000000-00000x00xxxx.json',
    input: 'source.srt',
    output: 'output.srt',
    target: 'en'
});

/* Initialize the translation */
translate.init();
```


# Options

| Option | Required | Default | Description |
|:-------------|:-------------:|:-------------:|-------------|
| `key` | :heavy_check_mark: | `None` | Your Google Cloud API JSON file. See [Google's Setup Page](https://cloud.google.com/translate/docs/setup) for more information.
| `input` | :heavy_check_mark: | `None` | Your `.srt` input file.
| `output` | :heavy_check_mark: | `None` | Your `.srt` output destination.
| `target` | :heavy_check_mark: | `None` | Target language (`en`, `ru` and so on). See [language support](https://cloud.google.com/translate/docs/languages) for more information.
| `delay` | :x: | `200` | Delay between requests made to Google Translate.
| `silent` | :x: | `False` | Disables the printing of translated lines.