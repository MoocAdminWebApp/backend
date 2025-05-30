const express=require("express");
const router=express.Router();
const {CourseOffering}=require("../models");

router.get('/',async(req,res)=>{
    try{
        const offerings=await CourseOffering.findAll();
        res.json(offerings);
    }catch(err){
        console.error('Fetch all error:',err)
        res.status(500).json({error:'Internal server error'})
    }
});

router.get('/:id',async(req,res)=>{
    try{
        const offering=await CourseOffering.findByPk(req.params.id);
        res.json(offering);
    }catch(err){
        console.error('Fetch one error',err);
        res.status(500).json({error:'Internal server error'})
    }
})

router.post('/',async(req,res)=>{
    try{
    const newOffering=await CourseOffering.create(req.body);
    res.status(201).json(newOffering);
    }catch(err){
        console.error('Create error',err);
        res.status(400).json({error:'Bad request'})
    }
})

router.put('/:id', async (req, res) => {
  try {
    const offering = await CourseOffering.findByPk(req.params.id);
    if (!offering) return res.status(404).json({ error: 'CourseOffering not found' });

    await offering.update(req.body);
    res.json(offering);
  } catch (err) {
    console.error('Update error:', err);
    res.status(400).json({ error: 'Bad Request' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const offering = await CourseOffering.findByPk(req.params.id);
    if (!offering) return res.status(404).json({ error: 'CourseOffering not found' });

    await offering.destroy();
    res.status(204).json({ message: 'CourseOffering deleted successfully' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports=router;