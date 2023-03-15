import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchGifsResponse } from '../Interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  private apiKey: string = 'k8hlvBWeTTW3BEoKEAIesOw3LLn5Dksi'
  private servicioUrl: string = 'https://api.giphy.com/v1/gifs'
  private _historial: string[] = []

  resultados: Gif[] = []

  get historial(): string[] {
    return [...this._historial]
  }

  buscarGifs(query: string) {

    if (query.trim().length == 0) {
      return;
    }
    query = query.trim().toLowerCase()
    if (!this._historial.includes(query)) {

      query = query.trim().toLowerCase()

      this._historial.unshift(query)
      this._historial = this._historial.splice(0, 10)

      localStorage.setItem('SEARCH', JSON.stringify(this._historial))

    }

    const params = new HttpParams().set('api_key', this.apiKey).set('limit', '10').set('q', query);

    this.http.get<SearchGifsResponse>(`${this.servicioUrl}/search`, {params})
      .subscribe(resp => {
        console.log(resp.data)
        this.resultados = resp.data
        localStorage.setItem('RESULTADOS', JSON.stringify(resp.data))
      })


  }

  constructor(private http: HttpClient) {

    const items = localStorage.getItem('SEARCH')

    if(items)
    {
      const aux = JSON.parse(items)
      this._historial = aux
    }

    const results = localStorage.getItem('RESULTADOS') // Estos strings es mejor llevarlos en un fichero aparte

    if(results)
    {
      const aux = JSON.parse(results)

      this.resultados = aux
    }
    

  }
}


