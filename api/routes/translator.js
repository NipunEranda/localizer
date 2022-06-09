const express = require('express');
const router = express.Router();

const translationService = require('../services/translation.service');

router.get('/', function(req, res) {
    res.status(200).json({ data: 'success', error: null });
});

router.post('/all/:from/:to',async function(req, res) {
    try{
        const translations = await translationService.translateTextAll(req.body.list, req.params.from, req.params.to);
        res.status(200).json({ data: translations, error: null });
    }catch(e){
        res.status(500).json({ data: null, error: e.message });
    }
});

router.post('/:from/:to', async function(req, res) {
    try{
        const translation = await translationService.translateText(req.body.text, req.params.from, req.params.to);
        res.status(200).json({ data: translation, error: null });
    }catch(e){
        res.status(500).json({ data: null, error: e.message });
    }
});

module.exports = router;