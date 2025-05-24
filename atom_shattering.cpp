// C++ code for atom shattering animation
// This will be integrated into the React application

#include <vector>
#include <cmath>
#include <random>
#include <algorithm>

class Particle {
public:
    float x, y;
    float vx, vy;
    float life;
    float size;
    float color[3];
    
    Particle(float _x, float _y) {
        x = _x;
        y = _y;
        
        // Random velocity
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_real_distribution<> vel_dist(-2.0, 2.0);
        std::uniform_real_distribution<> life_dist(0.5, 2.0);
        std::uniform_real_distribution<> size_dist(2.0, 8.0);
        
        vx = vel_dist(gen);
        vy = vel_dist(gen);
        life = life_dist(gen);
        size = size_dist(gen);
        
        // Color ranges from yellow to orange to red
        std::uniform_int_distribution<> color_type(0, 2);
        int type = color_type(gen);
        
        if (type == 0) {
            // Yellow
            color[0] = 1.0f;
            color[1] = 0.8f;
            color[2] = 0.0f;
        } else if (type == 1) {
            // Orange
            color[0] = 1.0f;
            color[1] = 0.4f;
            color[2] = 0.0f;
        } else {
            // Red
            color[0] = 1.0f;
            color[1] = 0.2f;
            color[2] = 0.0f;
        }
    }
    
    void update(float dt) {
        x += vx * dt;
        y += vy * dt;
        life -= dt;
    }
    
    bool isDead() {
        return life <= 0;
    }
};

class AtomShatteringSimulation {
private:
    std::vector<Particle> particles;
    float centerX, centerY;
    float intensity;
    
public:
    AtomShatteringSimulation(float _centerX, float _centerY, float _intensity) {
        centerX = _centerX;
        centerY = _centerY;
        intensity = _intensity;
        
        // Create initial particles based on intensity
        int particleCount = static_cast<int>(20 + intensity * 80);
        
        for (int i = 0; i < particleCount; i++) {
            particles.push_back(Particle(centerX, centerY));
        }
    }
    
    void update(float dt) {
        // Update all particles
        for (auto& particle : particles) {
            particle.update(dt);
        }
        
        // Remove dead particles
        particles.erase(
            std::remove_if(
                particles.begin(),
                particles.end(),
                [](const Particle& p) { return p.isDead(); }
            ),
            particles.end()
        );
        
        // Add new particles based on intensity
        std::random_device rd;
        std::mt19937 gen(rd());
        std::uniform_real_distribution<> spawn_chance(0.0, 1.0);
        
        if (spawn_chance(gen) < intensity * 0.3) {
            int newParticles = static_cast<int>(1 + intensity * 5);
            for (int i = 0; i < newParticles; i++) {
                particles.push_back(Particle(centerX, centerY));
            }
        }
    }
    
    const std::vector<Particle>& getParticles() const {
        return particles;
    }
    
    void setIntensity(float _intensity) {
        intensity = _intensity;
    }
};

// Function to convert simulation data to JSON for JavaScript integration
std::string getParticlesJson(const AtomShatteringSimulation& sim) {
    std::string json = "[";
    const auto& particles = sim.getParticles();
    
    for (size_t i = 0; i < particles.size(); i++) {
        const auto& p = particles[i];
        
        json += "{";
        json += "\"x\":" + std::to_string(p.x) + ",";
        json += "\"y\":" + std::to_string(p.y) + ",";
        json += "\"size\":" + std::to_string(p.size) + ",";
        json += "\"life\":" + std::to_string(p.life) + ",";
        json += "\"color\":[" + 
                std::to_string(p.color[0]) + "," + 
                std::to_string(p.color[1]) + "," + 
                std::to_string(p.color[2]) + "]";
        json += "}";
        
        if (i < particles.size() - 1) {
            json += ",";
        }
    }
    
    json += "]";
    return json;
}

// Main simulation loop - would be called from JavaScript
extern "C" {
    AtomShatteringSimulation* createSimulation(float centerX, float centerY, float intensity) {
        return new AtomShatteringSimulation(centerX, centerY, intensity);
    }
    
    void updateSimulation(AtomShatteringSimulation* sim, float dt, float intensity) {
        sim->setIntensity(intensity);
        sim->update(dt);
    }
    
    const char* getParticlesData(AtomShatteringSimulation* sim) {
        static std::string result;
        result = getParticlesJson(*sim);
        return result.c_str();
    }
    
    void destroySimulation(AtomShatteringSimulation* sim) {
        delete sim;
    }
}
