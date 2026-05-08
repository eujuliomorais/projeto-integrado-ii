CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Super Admin (Usando access_key_hash)
INSERT INTO usuarios (
    id,
    name,
    email_login,
    cpf,
    phone,
    role,
    is_active,
    access_key_hash,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Super Admin',
    'admin@access.com',
    '00000000000',
    '88999990000',
    'SUPER_ADMIN',
    true,
    '$2a$12$QW7vOHH9lPMFtVndQaqqjOALi.ZYOgdGB3uy/4DKDtoAHBshn/GtG',
    NOW(),
    NOW()
);

-- Admin 1
INSERT INTO usuarios (
    id,
    name,
    email_login,
    cpf,
    phone,
    role,
    is_active,
    senha_hash,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Admin1',
    'admin1@access.com',
    '11111111111',
    '88999990001',
    'ADMIN',
    true,
    '$2a$12$QW7vOHH9lPMFtVndQaqqjOALi.ZYOgdGB3uy/4DKDtoAHBshn/GtG',
    NOW(),
    NOW()
);

-- Admin 2
INSERT INTO usuarios (
    id,
    name,
    email_login,
    cpf,
    phone,
    role,
    is_active,
    senha_hash,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Admin2',
    'admin2@access.com',
    '22222222222',
    '88999990002',
    'ADMIN',
    true,
    '$2a$12$QW7vOHH9lPMFtVndQaqqjOALi.ZYOgdGB3uy/4DKDtoAHBshn/GtG',
    NOW(),
    NOW()
);

-- Admin 3
INSERT INTO usuarios (
    id,
    name,
    email_login,
    cpf,
    phone,
    role,
    is_active,
    senha_hash,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Admin3',
    'admin3@access.com',
    '33333333333',
    '88999990003',
    'ADMIN',
    true,
    '$2a$12$QW7vOHH9lPMFtVndQaqqjOALi.ZYOgdGB3uy/4DKDtoAHBshn/GtG',
    NOW(),
    NOW()
);

-- Admin 4
INSERT INTO usuarios (
    id,
    name,
    email_login,
    cpf,
    phone,
    role,
    is_active,
    senha_hash,
    created_at,
    updated_at
) VALUES (
    gen_random_uuid(),
    'Admin4',
    'admin4@access.com',
    '44444444444',
    '88999990004',
    'ADMIN',
    true,
    '$2a$12$QW7vOHH9lPMFtVndQaqqjOALi.ZYOgdGB3uy/4DKDtoAHBshn/GtG',
    NOW(),
    NOW()
);