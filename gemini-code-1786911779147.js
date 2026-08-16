import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Plus, Minus, Trash2, CheckCircle2, 
  MapPin, CreditCard, DollarSign, QrCode, ChevronRight, Sparkles 
} from 'lucide-react';

export default function DoceSaborApp() {
  // Estado do Cardápio e Carrinho
  const [cart, setCart] = useState({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('PIX');
  const [changeFor, setChangeFor] = useState('');
  
  // Dados do Formulário e CEP
  const [clientName, setClientName] = useState('');
  const [cep, setCep] = useState('');
  const [street, setStreet] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('');
  const [number, setNumber] = useState('');
  const [complement, setComplement] = useState('');
  const [observation, setObservation] = useState('');
  const [cepLoading, setCepLoading] = useState(false);

  const DELIVERY_FEE = 4.00;

  // Dados extraídos do PDF do Cardápio Doce Sabor
  const menuCategories = [
    {
      id: 'acai',
      name: 'Açaí na Tigela',
      description: 'Monte seu açaí com frutas, complementos e caldas deliciosas!',
      items: [
        {
          id: 'acai_350',
          name: 'Açaí 350 ml',
          price: 14.90,
          description: 'Açaí + 2 Frutas + 2 Acompanhamentos + 1 Calda',
          image: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 'acai_500',
          name: 'Açaí 500 ml',
          price: 21.90,
          description: 'Açaí + 3 Frutas + 3 Acompanhamentos + 1 Calda',
          image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 'acai_750',
          name: 'Açaí 750 ml',
          price: 27.90,
          description: 'Açaí + 3 Frutas + 4 Acompanhamentos + 1 Calda',
          image: 'https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    {
      id: 'especiais',
      name: 'Especiais da Casa',
      description: 'Combinações exclusivas e campeãs de sabor do Doce Sabor',
      items: [
        {
          id: 'doce_sabor',
          name: 'Doce Sabor',
          price: 21.90,
          description: '3 Bolas de sorvete chocolate + Chantilly + M&Ms',
          image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 'morango_feliz',
          name: 'Morango Feliz',
          price: 22.90,
          description: '3 Bolas de sorvete morango + Nutella + Tubete',
          image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 'delicia_tropical',
          name: 'Delícia Tropical',
          price: 15.90,
          description: '2 Bolas de sorvete de sua preferência + Salada de fruta',
          image: 'https://images.unsplash.com/photo-1505394033641-40c6ad1178d7?auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 'cone_especial',
          name: 'Cone Especial',
          price: 17.90,
          description: 'Cascão trufado com creme de avelã + 2 bolas de açaí + 1 morango',
          image: 'https://images.unsplash.com/photo-1545016160-5695843a859e?auto=format&fit=crop&w=600&q=80'
        }
      ]
    },
    {
      id: 'sorvetes',
      name: 'Sorvetes por Bola',
      description: 'Escolha seus sabores favoritos: Chocolate, Morango, Flocos, Creme, Coco, Napolitano, Cupuaçu, Oreo, Limão, Maracujá, Nata Goiabada.',
      items: [
        {
          id: 'sorvete_1',
          name: '1 Bola de Sorvete',
          price: 6.00,
          description: 'Escolha 1 sabor de sua preferência.',
          image: 'https://images.unsplash.com/photo-1557142046-c705a3adf536?auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 'sorvete_2',
          name: '2 Bolas de Sorvete',
          price: 10.00,
          description: 'Escolha até 2 sabores.',
          image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?auto=format&fit=crop&w=600&q=80'
        },
        {
          id: 'sorvete_3',
          name: '3 Bolas de Sorvete',
          price: 15.00,
          description: 'Escolha até 3 sabores.',
          image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&w=600&q=80'
        }
      ]
    }
  ];

  // Integração ViaCEP
  useEffect(() => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length === 8) {
      setCepLoading(true);
      fetch(`https://viacep.com.br/ws/${cleanCep}/json/`)
        .then(res => res.json())
        .then(data => {
          if (!data.erro) {
            setStreet(data.logradouro || '');
            setNeighborhood(data.bairro || '');
            setCity(data.localidade || '');
          }
          setCepLoading(false);
        })
        .catch(() => setCepLoading(false));
    }
  }, [cep]);

  // Manipulação de quantidade no carrinho
  const updateQuantity = (item, delta) => {
    setCart(prev => {
      const current = prev[item.id] ? prev[item.id].qty : 0;
      const nextQty = current + delta;
      
      if (nextQty <= 0) {
        const copy = { ...prev };
        delete copy[item.id];
        return copy;
      }
      
      return {
        ...prev,
        [item.id]: {
          item,
          qty: nextQty
        }
      };
    });
  };

  const totalItemsCount = Object.values(cart).reduce((acc, curr) => acc + curr.qty, 0);
  const subtotal = Object.values(cart).reduce((acc, curr) => acc + (curr.item.price * curr.qty), 0);
  const totalGeneral = subtotal > 0 ? subtotal + DELIVERY_FEE : 0;

  // Gerador de link do WhatsApp
  const handleCheckoutWhatsApp = (e) => {
    e.preventDefault();
    if (!clientName.trim()) {
      alert('Por favor, informe seu Nome.');
      return;
    }
    if (!street || !number || !neighborhood) {
      alert('Por favor, preencha o endereço completo de entrega.');
      return;
    }

    const itemsList = Object.values(cart)
      .map(c => `- ${c.qty}x ${c.item.name} (R$ ${(c.item.price * c.qty).toFixed(2)})`)
      .join('\n');

    let paymentText = paymentMethod;
    if (paymentMethod === 'Dinheiro' && changeFor) {
      paymentText += ` (Troco para R$ ${changeFor})`;
    }

    const addressText = `${street}, nº ${number}${complement ? ' - ' + complement : ''}, ${neighborhood}, ${city} - CEP: ${cep}`;

    const message = `Olá Doce Sabor! Gostaria de fazer o pedido:
${itemsList}

Observações: ${observation || 'Nenhuma'}
Subtotal: R$ ${subtotal.toFixed(2)}
Taxa de Entrega: R$ ${DELIVERY_FEE.toFixed(2)}
Total Final: R$ ${totalGeneral.toFixed(2)}
Forma de Pagamento: ${paymentText}
Endereço para entrega: ${addressText}
Nome do Cliente: ${clientName}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=5581993753501&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen bg-pink-50 text-gray-800 pb-28 font-sans antialiased">
      
      {/* Header Estilizado */}
      <header className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-full shadow-md text-pink-500">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-wide uppercase">Doce Sabor</h1>
              <p className="text-xs text-pink-100 font-medium">Açaí & Sorveteria Artesanal</p>
            </div>
          </div>
          <div className="bg-pink-600/80 px-3 py-1 rounded-full text-xs font-semibold border border-pink-300/30">
            Aberto agora 🍦
          </div>
        </div>
      </header>

      {/* Container Principal */}
      <main className="max-w-md mx-auto px-4 py-6 space-y-8">
        
        {/* Renderização das Categorias */}
        {menuCategories.map((category) => (
          <section key={category.id} className="space-y-4">
            <div className="border-b-2 border-pink-200 pb-2">
              <h2 className="text-xl font-bold text-pink-700">{category.name}</h2>
              <p className="text-xs text-gray-500">{category.description}</p>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {category.items.map((item) => {
                const currentQty = cart[item.id] ? cart[item.id].qty : 0;

                return (
                  <div 
                    key={item.id} 
                    className="bg-white rounded-2xl shadow-sm border border-pink-100 overflow-hidden flex flex-col justify-between transition hover:shadow-md"
                  >
                    <div className="flex p-3 gap-3">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-24 h-24 object-cover rounded-xl border border-pink-50 flex-shrink-0"
                      />
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="font-bold text-gray-900 text-sm leading-tight">{item.name}</h3>
                            <span className="font-extrabold text-pink-600 text-sm ml-2">
                              R$ {item.price.toFixed(2).replace('.', ',')}
                            </span>
                          </div>
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.description}</p>
                        </div>
                      </div>
                    </div>

                    {/* Controles de Quantidade */}
                    <div className="bg-pink-50/60 px-3 py-2 flex items-center justify-between border-t border-pink-100">
                      <span className="text-xs font-medium text-pink-800">Quantidade:</span>
                      <div className="flex items-center space-x-3">
                        <button 
                          onClick={() => updateQuantity(item, -1)}
                          disabled={currentQty === 0}
                          className="w-8 h-8 rounded-full bg-white border border-pink-200 flex items-center justify-center text-pink-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm active:scale-95 transition"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold text-gray-800 text-sm w-4 text-center">{currentQty}</span>
                        <button 
                          onClick={() => updateQuantity(item, 1)}
                          className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center shadow-sm active:scale-95 transition hover:bg-pink-700"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        ))}
      </main>

      {/* Carrinho Flutuante Inferior */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-pink-200 shadow-2xl z-40">
          <div className="max-w-md mx-auto flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500 font-medium">{totalItemsCount} {totalItemsCount === 1 ? 'item selecionado' : 'itens selecionados'}</p>
              <p className="text-lg font-black text-pink-700">R$ {subtotal.toFixed(2).replace('.', ',')}</p>
            </div>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold px-6 py-3 rounded-xl shadow-lg flex items-center space-x-2 active:scale-95 transition hover:brightness-105"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Ver Carrinho</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal de Checkout / Carrinho */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-3xl max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col animate-in fade-in slide-in-from-bottom duration-200">
            
            {/* Cabeçalho do Modal */}
            <div className="sticky top-0 bg-white border-b border-gray-100 p-4 flex items-center justify-between z-10">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-pink-600" />
                Resumo do Pedido
              </h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200"
              >
                ✕
              </button>
            </div>

            {/* Corpo do Modal */}
            <div className="p-4 space-y-6">
              
              {/* Lista de Itens no Carrinho */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Itens Escolhidos</h3>
                {Object.values(cart).map(({ item, qty }) => (
                  <div key={item.id} className="flex justify-between items-center bg-pink-50/50 p-2.5 rounded-xl border border-pink-100">
                    <div className="flex-1">
                      <p className="font-bold text-sm text-gray-800">{qty}x {item.name}</p>
                      <p className="text-xs text-pink-600 font-semibold">R$ {(item.price * qty).toFixed(2).replace('.', ',')}</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <button onClick={() => updateQuantity(item, -1)} className="p-1 text-gray-500 hover:text-pink-600"><Minus className="w-3.5 h-3.5"/></button>
                      <span className="text-xs font-bold px-1">{qty}</span>
                      <button onClick={() => updateQuantity(item, 1)} className="p-1 text-gray-500 hover:text-pink-600"><Plus className="w-3.5 h-3.5"/></button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Dados do Cliente e Endereço */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Identificação e Endereço</h3>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Seu Nome Completo *</label>
                  <input 
                    type="text" 
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Ex: Maria Silva"
                    className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">CEP *</label>
                    <input 
                      type="text" 
                      value={cep}
                      onChange={(e) => setCep(e.target.value)}
                      placeholder="00000-000"
                      maxLength={9}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-pink-500"
                    />
                    {cepLoading && <span className="text-[10px] text-pink-500 font-medium mt-0.5 block">Buscando CEP...</span>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Cidade</label>
                    <input 
                      type="text" 
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Cidade"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
                      readOnly
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Rua / Logradouro</label>
                    <input 
                      type="text" 
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      placeholder="Preenchido pelo CEP"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 bg-gray-50 text-gray-500"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Número *</label>
                    <input 
                      type="text" 
                      value={number}
                      onChange={(e) => setNumber(e.target.value)}
                      placeholder="Ex: 123"
                      className="w-full px-3 py-2 text-sm rounded-xl border border-gray-200 focus:outline-none focus:ring-