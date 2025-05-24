// C# code for atom shattering animation
// This will be integrated into the React application

using System;
using System.Collections.Generic;
using System.Text.Json;

namespace AtomShatteringSimulation
{
    public class Particle
    {
        public float X { get; set; }
        public float Y { get; set; }
        public float VelocityX { get; set; }
        public float VelocityY { get; set; }
        public float Life { get; set; }
        public float Size { get; set; }
        public float[] Color { get; set; }
        
        private static Random random = new Random();
        
        public Particle(float centerX, float centerY)
        {
            X = centerX;
            Y = centerY;
            
            // Random velocity
            VelocityX = (float)((random.NextDouble() * 4) - 2);
            VelocityY = (float)((random.NextDouble() * 4) - 2);
            
            // Random lifetime
            Life = (float)((random.NextDouble() * 1.5) + 0.5);
            
            // Random size
            Size = (float)((random.NextDouble() * 6) + 2);
            
            // Color ranges from yellow to orange to red
            int colorType = random.Next(3);
            
            if (colorType == 0)
            {
                // Yellow
                Color = new float[] { 1.0f, 0.8f, 0.0f };
            }
            else if (colorType == 1)
            {
                // Orange
                Color = new float[] { 1.0f, 0.4f, 0.0f };
            }
            else
            {
                // Red
                Color = new float[] { 1.0f, 0.2f, 0.0f };
            }
        }
        
        public void Update(float deltaTime)
        {
            X += VelocityX * deltaTime;
            Y += VelocityY * deltaTime;
            Life -= deltaTime;
        }
        
        public bool IsDead()
        {
            return Life <= 0;
        }
    }
    
    public class AtomShatteringSimulator
    {
        private List<Particle> particles = new List<Particle>();
        private float centerX;
        private float centerY;
        private float intensity;
        private Random random = new Random();
        
        public AtomShatteringSimulator(float centerX, float centerY, float intensity)
        {
            this.centerX = centerX;
            this.centerY = centerY;
            this.intensity = intensity;
            
            // Create initial particles based on intensity
            int particleCount = (int)(20 + intensity * 80);
            
            for (int i = 0; i < particleCount; i++)
            {
                particles.Add(new Particle(centerX, centerY));
            }
        }
        
        public void Update(float deltaTime)
        {
            // Update all particles
            for (int i = particles.Count - 1; i >= 0; i--)
            {
                particles[i].Update(deltaTime);
                
                // Remove dead particles
                if (particles[i].IsDead())
                {
                    particles.RemoveAt(i);
                }
            }
            
            // Add new particles based on intensity
            if (random.NextDouble() < intensity * 0.3)
            {
                int newParticles = (int)(1 + intensity * 5);
                for (int i = 0; i < newParticles; i++)
                {
                    particles.Add(new Particle(centerX, centerY));
                }
            }
        }
        
        public List<Particle> GetParticles()
        {
            return particles;
        }
        
        public void SetIntensity(float intensity)
        {
            this.intensity = intensity;
        }
        
        public string GetParticlesJson()
        {
            return JsonSerializer.Serialize(particles);
        }
    }
    
    // Interface for JavaScript interop
    public static class SimulationInterface
    {
        private static Dictionary<int, AtomShatteringSimulator> simulations = new Dictionary<int, AtomShatteringSimulator>();
        private static int nextId = 1;
        
        public static int CreateSimulation(float centerX, float centerY, float intensity)
        {
            int id = nextId++;
            simulations[id] = new AtomShatteringSimulator(centerX, centerY, intensity);
            return id;
        }
        
        public static void UpdateSimulation(int id, float deltaTime, float intensity)
        {
            if (simulations.ContainsKey(id))
            {
                simulations[id].SetIntensity(intensity);
                simulations[id].Update(deltaTime);
            }
        }
        
        public static string GetParticlesData(int id)
        {
            if (simulations.ContainsKey(id))
            {
                return simulations[id].GetParticlesJson();
            }
            return "[]";
        }
        
        public static void DestroySimulation(int id)
        {
            if (simulations.ContainsKey(id))
            {
                simulations.Remove(id);
            }
        }
    }
}
