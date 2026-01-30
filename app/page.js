export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>✅ Emploseek</h1>
      <p>Site de vérification des offres d'emploi</p>
      
      <h2>🔗 Liens de test :</h2>
      <ul>
        <li><a href="/api/test">/api/test</a> - Test API</li>
        <li><a href="/api/check/DEV001">/api/check/DEV001</a> - Vérifier offre DEV001</li>
        <li><a href="/api/check/DEV002">/api/check/DEV002</a> - Vérifier offre DEV002</li>
        <li><a href="/api/check/TEST123">/api/check/TEST123</a> - Référence inexistante</li>
      </ul>
    </div>
  );
}
