import React from 'react';
import { 
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Paper,
  Chip
} from '@mui/material';
import {
  Email,
  Phone,
  LocationOn,
  Work,
  School,
  Edit,
  LinkedIn,
  GitHub,
  Twitter
} from '@mui/icons-material';

const ProfilePage = () => {
  // Sample user data
  const user = {
    name: 'Alex Johnson',
    title: 'Senior Software Engineer',
    avatar: '/path-to-avatar.jpg', // Replace with actual path or URL
    email: 'alex.johnson@example.com',
    phone: '(555) 123-4567',
    location: 'San Francisco, CA',
    company: 'Tech Solutions Inc.',
    education: 'MIT, Computer Science',
    bio: 'Passionate about building scalable web applications with React and Node.js. Open source contributor and tech enthusiast.',
    skills: ['React', 'JavaScript', 'Node.js', 'TypeScript', 'MUI', 'CSS'],
    social: {
      linkedin: 'https://linkedin.com/in/alexjohnson',
      github: 'https://github.com/alexjohnson',
      twitter: 'https://twitter.com/alexjohnson'
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Left Column - Profile Card */}
        <Grid item xs={12} md={4}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 3 }}>
              <Avatar
                alt={user.name}
                src={user.avatar}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <Typography variant="h5" component="h1" gutterBottom>
                {user.name}
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {user.title}
              </Typography>
              
              <Button 
                variant="outlined" 
                startIcon={<Edit />}
                sx={{ mt: 1, mb: 3 }}
              >
                Edit Profile
              </Button>
              
              <Divider sx={{ width: '100%', my: 2 }} />
              
              <List sx={{ width: '100%' }}>
                <ListItem>
                  <ListItemIcon>
                    <Email />
                  </ListItemIcon>
                  <ListItemText primary="Email" secondary={user.email} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Phone />
                  </ListItemIcon>
                  <ListItemText primary="Phone" secondary={user.phone} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <LocationOn />
                  </ListItemIcon>
                  <ListItemText primary="Location" secondary={user.location} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Work />
                  </ListItemIcon>
                  <ListItemText primary="Company" secondary={user.company} />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <School />
                  </ListItemIcon>
                  <ListItemText primary="Education" secondary={user.education} />
                </ListItem>
              </List>
              
              <Divider sx={{ width: '100%', my: 2 }} />
              
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button 
                  variant="contained" 
                  color="primary" 
                  startIcon={<LinkedIn />}
                  href={user.social.linkedin}
                  target="_blank"
                />
                <Button 
                  variant="contained" 
                  color="inherit" 
                  startIcon={<GitHub />}
                  href={user.social.github}
                  target="_blank"
                />
                <Button 
                  variant="contained" 
                  color="info" 
                  startIcon={<Twitter />}
                  href={user.social.twitter}
                  target="_blank"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Right Column - Details */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              About
            </Typography>
            <Typography paragraph>
              {user.bio}
            </Typography>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Skills
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {user.skills.map((skill) => (
                <Chip key={skill} label={skill} variant="outlined" />
              ))}
            </Box>
          </Paper>
          
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Experience
            </Typography>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                Senior Software Engineer
              </Typography>
              <Typography color="text.secondary">
                Tech Solutions Inc. • 2019 - Present
              </Typography>
              <Typography paragraph sx={{ mt: 1 }}>
                Lead developer for the company's flagship product. Implemented new features using React and Node.js.
              </Typography>
            </Box>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                Software Engineer
              </Typography>
              <Typography color="text.secondary">
                WebDev Co. • 2016 - 2019
              </Typography>
              <Typography paragraph sx={{ mt: 1 }}>
                Developed and maintained several client applications. Collaborated with designers and product managers.
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProfilePage;