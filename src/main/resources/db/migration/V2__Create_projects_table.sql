-- Create projects table
CREATE TABLE projects (
    id UUID PRIMARY KEY,
    version BIGINT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL,
    active BOOLEAN NOT NULL DEFAULT true,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(255),
    sphere VARCHAR(255),
    description TEXT,
    location VARCHAR(255),
    owner_id UUID NOT NULL,
    FOREIGN KEY (owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_project_name ON projects(name);
CREATE INDEX idx_project_sphere ON projects(sphere);

-- Create project_required_skills table
CREATE TABLE project_required_skills (
    project_id UUID NOT NULL,
    skill VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create project_team table
CREATE TABLE project_team (
    project_id UUID NOT NULL,
    team_member VARCHAR(255),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);

-- Create project_members join table (many-to-many)
CREATE TABLE project_members (
    project_id UUID NOT NULL,
    user_id UUID NOT NULL,
    PRIMARY KEY (project_id, user_id),
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
