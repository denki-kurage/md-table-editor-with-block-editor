
type OgpItem =
{
    type: string;
    title: string;
    image: string;
    url: string;
}

class OgpGenerator
{
    public readonly sites: Map<string, OgpItem> = new Map();
    private properties = ['og:type', 'og:title', 'og:url', 'og:image'];
    public constructor()
    {

    }

    public async add(url: string)
    {
        if(!this.sites.has(url))
        {
            const o = await this.loadOgpItem(url);
            this.sites.set(url, o);
            return o;
        }
    }

    public async loadOgpItem(url: string): Promise<OgpItem>
    {
        const res = await fetch(url, { mode: 'no-cors' });

        if(res.ok)
        {
            const result = await res.text();
            const p = new DOMParser();
            const doc = p.parseFromString(result, 'text/html');

            const metas = doc.querySelectorAll('meta[property^=og]');
            const map = new Map([...metas]
                .filter(m => this.properties.includes(m.getAttribute('property') ?? ''))
                .map(m => [m.getAttribute('property'), m.getAttribute('content')]))
            
            return {
                title: map.get('og:title') ?? '',
                type: map.get('og:type') ?? '',
                image: map.get('og:image') ?? '',
                url: map.get('og:url') ?? ''
            };
        }
        else
        {
            throw new Error('responsed error');
        }
    }
}

export const ogpGenerator = new OgpGenerator();
