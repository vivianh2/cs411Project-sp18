 i m p o r t   R e a c t ,   { 
 	 F r a g m e n t 
 }   f r o m   " r e a c t " ; 
 i m p o r t   { 
 	 r e n d e r 
 }   f r o m   " r e a c t - d o m " ; 
 i m p o r t   { 
 	 G r i d , 
 	 P a p e r , 
 	 T y p o g r a p h y , 
 	 L i s t 
 }   f r o m   " m a t e r i a l - u i " ; 
 i m p o r t   { 
 	 L i s t I t e m , 
 	 L i s t I t e m T e x t 
 }   f r o m   " m a t e r i a l - u i / L i s t " ; 
 
 c o n s t   s t y l e s   =   { 
 	 P a p e r :   { 
 	 	 p a d d i n g :   0 , 
 	 	 m a r g i n T o p :   0 , 
 	 	 m a r g i n B o t t o m :   0 , 
 	 	 w i d t h :   4 0 0 , 
 	 	 h e i g h t :   3 0 0 , 
 	 	 o v e r f l o w Y :   " a u t o " 
 	 } 
 } ; 
 
 e x p o r t   d e f a u l t   ( { 
 	 s e l l e r s 
 } )   = >   ( 
 	 < G r i d   c o n t a i n e r > 
         < G r i d   i t e m   s m > 
             < P a p e r   s t y l e = { s t y l e s . P a p e r } > 
                 { s e l l e r s . m a p ( ( {   i d ,   n a m e ,   p r i c e   } )   = >   ( 
                     < F r a g m e n t   k e y = { i d } > 
                         < L i s t   c o m p o n e n t = " u l " > 
                             < L i s t I t e m   k e y = { i d }   b u t t o n > 
                                 < L i s t I t e m T e x t   p r i m a r y = { n a m e }   s e c o n d a r y = { p r i c e }   / > 
                             < / L i s t I t e m > 
                         < / L i s t > 
                     < / F r a g m e n t > 
                 ) ) } 
             < / P a p e r > 
         < / G r i d > 
     < / G r i d > 
 ) ;