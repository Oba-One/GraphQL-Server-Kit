export default function catchError(promise) {
    return promise.then(data => {
       return [null, data];
    })
    .catch(err => [err]);
 }