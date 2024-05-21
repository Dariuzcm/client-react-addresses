  # React + TypeScript + Vite
## Instrucciones de despliegue

- Instale dependencias 
```
npm install
```
- Puedes construir el proyecto puede utilizar
```
npm run build
```
    
- En caso de haber buildeado el proyecto
    - Inicie live server con la carpeta dist
    - Algunas veces no suele cargar el javascript o css en tal caso en el index.html cambie la linea de importacion a la siguiente 
```html
    <script type="module" crossorigin src="./assets/index-DG0JFuGj.js"></script>
    <link rel="stylesheet" crossorigin href="./assets/index-B3FVKB9O.css">
    <!--- 
      Esto deberia solucionar el problema, ya que las importaciones de los asssets estan 
      apuntando a la raiz por lo que al añadir el punto accedemos a la ruta relativa 
    -->
```
