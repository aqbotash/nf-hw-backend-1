import { Router } from 'express';
import passport from './passportConfig';

const router = Router();

router.get('/bitbucket', passport.authenticate('bitbucket'));

router.get('/bitbucket/callback', 
  passport.authenticate('bitbucket', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:3000');
  }
);

export default router;
