import { query } from '@/lib/neon-db';

// Fonction pour logger avec timestamp
function log(message, data = null) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ADMIN API: ${message}`);
  if (data) {
    console.log(`[${timestamp}] Data:`, JSON.stringify(data, null, 2));
  }
}

// Fonction pour logger les erreurs
function logError(error, context = '') {
  const timestamp = new Date().toISOString();
  console.error(`[${timestamp}] ADMIN API ERROR${context ? ` (${context})` : ''}:`, {
    message: error.message,
    code: error.code,
    stack: error.stack,
    name: error.name
  });
}

// GET: Récupérer toutes les offres
export async function GET(request) {
  try {
    log('=== GET /api/admin/jobs START ===');
    
    // Log des headers pour debug
    const headers = Object.fromEntries(request.headers.entries());
    log('Request headers:', { 
      contentType: headers['content-type'],
      authorization: headers['authorization'] ? 'Present' : 'Missing',
      origin: headers['origin'],
      referer: headers['referer']
    });
    
    // Vérifier la connexion à la base de données
    log('Checking DATABASE_URL...');
    if (!process.env.DATABASE_URL) {
      logError(new Error('DATABASE_URL is not defined'), 'Environment');
      return Response.json(
        { 
          status: 'error', 
          message: 'Configuration de base de données manquante',
          details: 'DATABASE_URL environment variable is not set'
        },
        { status: 500 }
      );
    }
    
    log('DATABASE_URL is configured');
    log('Executing database query...');
    
    // Exécuter la requête
    const result = await query(`
      SELECT id, reference, title, company, location, salary, status, 
             created_at 
      FROM jobs 
      ORDER BY created_at DESC
    `);
    
    log(`Query executed successfully. Found ${result.rows.length} rows`);
    
    // Log des premiers résultats (limité pour éviter trop de logs)
    if (result.rows.length > 0) {
      log('First job sample:', {
        id: result.rows[0].id,
        reference: result.rows[0].reference,
        title: result.rows[0].title,
        status: result.rows[0].status
      });
      
      if (result.rows.length > 1) {
        log(`Plus ${result.rows.length - 1} autres offres`);
      }
    } else {
      log('No jobs found in database');
      
      // Vérifier si la table existe
      try {
        const tableCheck = await query(`
          SELECT EXISTS (
            SELECT FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name = 'jobs'
          );
        `);
        
        log('Table exists check:', { tableExists: tableCheck.rows[0].exists });
        
        if (!tableCheck.rows[0].exists) {
          logError(new Error('Table "jobs" does not exist'), 'Table Check');
          return Response.json({
            status: 'error',
            message: 'Table des offres non trouvée',
            details: 'La table "jobs" n\'existe pas dans la base de données',
            suggestion: 'Exécutez la création de table dans Neon SQL Editor'
          }, { status: 500 });
        }
      } catch (tableError) {
        logError(tableError, 'Table Check Query');
      }
    }
    
    log('=== GET /api/admin/jobs END ===');
    
    return Response.json({
      status: 'success',
      data: result.rows,
      count: result.rows.length,
      timestamp: new Date().toISOString(),
      database: 'connected'
    });
    
  } catch (error) {
    logError(error, 'GET Request');
    
    // Réponses d'erreur détaillées selon le type d'erreur
    let errorMessage = 'Erreur serveur interne';
    let errorDetails = error.message;
    let statusCode = 500;
    
    if (error.message.includes('getaddrinfo ENOTFOUND')) {
      errorMessage = 'Impossible de se connecter à la base de données';
      errorDetails = 'Le serveur de base de données est injoignable';
    } else if (error.message.includes('password authentication')) {
      errorMessage = 'Authentification base de données échouée';
      errorDetails = 'Mot de passe ou utilisateur incorrect';
    } else if (error.message.includes('does not exist')) {
      errorMessage = 'Table ou colonne inexistante';
      errorDetails = 'La structure de la base de données a changé';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Timeout de connexion à la base';
      errorDetails = 'La base de données met trop de temps à répondre';
    }
    
    return Response.json(
      { 
        status: 'error', 
        message: errorMessage,
        details: errorDetails,
        errorType: error.name,
        timestamp: new Date().toISOString()
      },
      { status: statusCode }
    );
  }
}

// POST: Créer une nouvelle offre
export async function POST(request) {
  try {
    log('=== POST /api/admin/jobs START ===');
    
    // Récupérer les données
    const data = await request.json();
    log('Received job data:', data);
    
    const { reference, title, company, location, salary, status } = data;
    
    // Validation
    if (!reference || !title) {
      log('Validation failed: Missing reference or title', { reference, title });
      return Response.json(
        { 
          status: 'error', 
          message: 'Champs requis manquants',
          details: 'La référence et le titre sont obligatoires',
          requiredFields: ['reference', 'title']
        },
        { status: 400 }
      );
    }
    
    // Validation de la référence (format)
    if (reference.length > 50) {
      log('Validation failed: Reference too long', { reference });
      return Response.json(
        { 
          status: 'error', 
          message: 'Référence trop longue',
          details: 'La référence ne doit pas dépasser 50 caractères'
        },
        { status: 400 }
      );
    }
    
    log('Validation passed, inserting into database...');
    
    // Insertion dans la base
    const result = await query(
      `INSERT INTO jobs (reference, title, company, location, salary, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING id, reference, title, company, location, salary, status, created_at`,
      [reference, title, company, location, salary, status || 'active']
    );
    
    const newJob = result.rows[0];
    log('Job created successfully:', newJob);
    
    log('=== POST /api/admin/jobs END ===');
    
    return Response.json({
      status: 'success',
      message: 'Offre créée avec succès',
      data: newJob,
      timestamp: new Date().toISOString()
    }, { status: 201 });
    
  } catch (error) {
    logError(error, 'POST Request');
    
    // Gestion des erreurs spécifiques
    if (error.code === '23505') { // Violation de contrainte UNIQUE
      return Response.json(
        { 
          status: 'error', 
          message: 'Référence déjà existante',
          details: `La référence "${error.detail?.split('=')[1]?.replace(/[()]/g, '')}" existe déjà`,
          errorCode: 'DUPLICATE_REFERENCE'
        },
        { status: 409 }
      );
    }
    
    if (error.code === '23502') { // Violation de NOT NULL
      return Response.json(
        { 
          status: 'error', 
          message: 'Champ obligatoire manquant',
          details: error.message,
          errorCode: 'NULL_CONSTRAINT_VIOLATION'
        },
        { status: 400 }
      );
    }
    
    if (error.code === '22P02') { // Mauvais type de données
      return Response.json(
        { 
          status: 'error', 
          message: 'Type de données incorrect',
          details: 'Un champ contient un type de données invalide',
          errorCode: 'INVALID_DATA_TYPE'
        },
        { status: 400 }
      );
    }
    
    return Response.json(
      { 
        status: 'error', 
        message: 'Erreur lors de la création',
        details: error.message,
        errorCode: error.code,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// OPTIONS: Pour les requêtes CORS
export async function OPTIONS(request) {
  log('OPTIONS request received');
  
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  });
}
