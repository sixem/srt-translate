import GoogleCloud from '@google-cloud/translate';

export default class googleTranslate
{
	constructor(options)
	{
		process.env.GOOGLE_APPLICATION_CREDENTIALS = options.key;

		this.translate = new GoogleCloud.v2.Translate();

        this.options = options;
        
		return this;
	}

	translateText = (text, index, total) =>
	{
		return new Promise((resolve, reject) =>
		{
			this.translate.translate(text, this.options.target).then((text) =>
			{
				let [translation] = text;

                if(!this.options.silent)
                {
                    console.log(`Line: ${index + 1} of ${total}`, '->', translation);
                }

				resolve(translation);
			}).catch((error) =>
			{
				reject(error);
			});
		});
	}
};